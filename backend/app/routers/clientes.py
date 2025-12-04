# app/routers/clientes.py - CRUD de Clientes/Leads com segurança por usuário

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.cliente import ClienteLead
from app.models.user import User
from app.schemas.cliente import (
    ClienteLeadCreate,
    ClienteLeadResponse,
    ClienteLeadUpdate,
)
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/clientes", tags=["Clientes/Leads"])


@router.post(
    "/", response_model=ClienteLeadResponse, status_code=status.HTTP_201_CREATED
)
async def criar_cliente(
    cliente_data: ClienteLeadCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Criar novo cliente/lead"""

    # Verificar se email já existe PARA ESTE USUÁRIO (se fornecido)
    if cliente_data.e_mail:
        existing = (
            db.query(ClienteLead)
            .filter(
                ClienteLead.e_mail == cliente_data.e_mail,
                ClienteLead.id_usuario == current_user.id_usuario,
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Você já tem um cliente com este email",
            )

    # Criar cliente vinculado ao usuário atual
    novo_cliente = ClienteLead(
        nome=cliente_data.nome,
        telefone=cliente_data.telefone,
        e_mail=cliente_data.e_mail,
        empresa=cliente_data.empresa,
        observacao=cliente_data.observacao,
        id_usuario=current_user.id_usuario,  # ✅ VINCULAR AO USUÁRIO
    )

    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)

    return novo_cliente


@router.get("/", response_model=List[ClienteLeadResponse])
async def listar_clientes(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Listar todos os clientes/leads DO USUÁRIO ATUAL"""

    # ✅ FILTRAR APENAS CLIENTES DO USUÁRIO LOGADO
    clientes = (
        db.query(ClienteLead)
        .filter(ClienteLead.id_usuario == current_user.id_usuario)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return clientes


@router.get("/{id_cliente}", response_model=ClienteLeadResponse)
async def obter_cliente(
    id_cliente: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter cliente específico por ID (apenas se pertencer ao usuário)"""

    # ✅ VERIFICAR SE O CLIENTE PERTENCE AO USUÁRIO
    cliente = (
        db.query(ClienteLead)
        .filter(
            ClienteLead.id_cliente == id_cliente,
            ClienteLead.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado"
        )

    return cliente


@router.put("/{id_cliente}", response_model=ClienteLeadResponse)
async def atualizar_cliente(
    id_cliente: UUID,
    cliente_data: ClienteLeadUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar dados do cliente (apenas se pertencer ao usuário)"""

    # ✅ VERIFICAR SE O CLIENTE PERTENCE AO USUÁRIO
    cliente = (
        db.query(ClienteLead)
        .filter(
            ClienteLead.id_cliente == id_cliente,
            ClienteLead.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado"
        )

    # Atualizar apenas campos fornecidos
    update_data = cliente_data.dict(exclude_unset=True)

    # Verificar email duplicado se estiver sendo atualizado (apenas para este usuário)
    if "e_mail" in update_data and update_data["e_mail"]:
        existing = (
            db.query(ClienteLead)
            .filter(
                ClienteLead.e_mail == update_data["e_mail"],
                ClienteLead.id_cliente != id_cliente,
                ClienteLead.id_usuario
                == current_user.id_usuario,  # ✅ APENAS DESTE USUÁRIO
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Você já tem um cliente com este email",
            )

    for field, value in update_data.items():
        setattr(cliente, field, value)

    db.commit()
    db.refresh(cliente)

    return cliente


@router.delete("/{id_cliente}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_cliente(
    id_cliente: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletar cliente (apenas se pertencer ao usuário)"""

    # ✅ VERIFICAR SE O CLIENTE PERTENCE AO USUÁRIO
    cliente = (
        db.query(ClienteLead)
        .filter(
            ClienteLead.id_cliente == id_cliente,
            ClienteLead.id_usuario == current_user.id_usuario,
        )
        .first()
    )

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado"
        )

    db.delete(cliente)
    db.commit()

    return None


@router.get("/buscar/nome/{nome}", response_model=List[ClienteLeadResponse])
async def buscar_por_nome(
    nome: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar clientes por nome (busca parcial) - apenas do usuário atual"""

    # ✅ FILTRAR APENAS CLIENTES DO USUÁRIO
    clientes = (
        db.query(ClienteLead)
        .filter(
            ClienteLead.nome.ilike(f"%{nome}%"),
            ClienteLead.id_usuario == current_user.id_usuario,
        )
        .all()
    )

    return clientes


@router.get("/buscar/empresa/{empresa}", response_model=List[ClienteLeadResponse])
async def buscar_por_empresa(
    empresa: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar clientes por empresa - apenas do usuário atual"""

    # ✅ FILTRAR APENAS CLIENTES DO USUÁRIO
    clientes = (
        db.query(ClienteLead)
        .filter(
            ClienteLead.empresa.ilike(f"%{empresa}%"),
            ClienteLead.id_usuario == current_user.id_usuario,
        )
        .all()
    )

    return clientes
