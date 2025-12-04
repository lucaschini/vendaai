from datetime import datetime, timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.models.cliente import ClienteLead
from app.models.user import User
from app.models.venda import Venda
from app.schemas.user import UserResponse
from app.utils.database import get_db
from app.utils.security import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/dashboard", response_model=UserResponse)
async def get_dashboard(current_user: User = Depends(get_current_user)):
    """
    Endpoint protegido - Dashboard do usuário
    Retorna informações do usuário autenticado
    """
    return current_user


@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Retorna estatísticas do dashboard do usuário
    """

    # Data atual e mês anterior
    now = datetime.now()
    primeiro_dia_mes = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    primeiro_dia_mes_anterior = (primeiro_dia_mes - timedelta(days=1)).replace(day=1)
    ultimo_dia_mes_anterior = primeiro_dia_mes - timedelta(seconds=1)

    # ========================================
    # VENDAS DO MÊS ATUAL
    # ========================================
    vendas_mes_atual = db.query(func.sum(Venda.valor)).filter(
        Venda.id_usuario == current_user.id_usuario,
        Venda.data_criacao >= primeiro_dia_mes,
        Venda.status == "fechada",
    ).scalar() or Decimal(0)

    # VENDAS DO MÊS ANTERIOR
    vendas_mes_anterior = db.query(func.sum(Venda.valor)).filter(
        Venda.id_usuario == current_user.id_usuario,
        Venda.data_criacao >= primeiro_dia_mes_anterior,
        Venda.data_criacao <= ultimo_dia_mes_anterior,
        Venda.status == "fechada",
    ).scalar() or Decimal(0)

    # ========================================
    # TOTAL DE CLIENTES (LEADS ATIVOS)
    # ========================================
    total_clientes = (
        db.query(func.count(ClienteLead.id_cliente))
        .filter(ClienteLead.id_usuario == current_user.id_usuario)
        .scalar()
        or 0
    )

    total_vendas = (
        db.query(func.count(Venda.id_cliente))
        .filter(Venda.id_usuario == current_user.id_usuario)
        .scalar()
        or 0
    )

    # Clientes criados no mês anterior (para comparação)
    # Como não temos data_criacao em ClienteLead, vamos usar uma estimativa
    # baseada no crescimento de vendas
    total_clientes_mes_anterior = total_clientes  # Placeholder

    # ========================================
    # CONVERSÃO (Vendas fechadas / Total de clientes)
    # ========================================
    total_vendas_fechadas = (
        db.query(func.count(Venda.id_venda))
        .filter(Venda.id_usuario == current_user.id_usuario, Venda.status == "fechada")
        .scalar()
        or 0
    )

    conversao_rate = (
        (total_vendas_fechadas / total_vendas * 100) if total_vendas > 0 else 0
    )

    # ========================================
    # TICKET MÉDIO
    # ========================================
    ticket_medio = db.query(func.avg(Venda.valor)).filter(
        Venda.id_usuario == current_user.id_usuario, Venda.status == "fechada"
    ).scalar() or Decimal(0)

    # ========================================
    # VENDAS POR MÊS (últimos 7 meses)
    # ========================================
    vendas_por_mes = []

    for i in range(6, -1, -1):  # 7 meses (incluindo o atual)
        data_ref = now - timedelta(days=30 * i)
        primeiro_dia = data_ref.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )

        if i > 0:
            ultimo_dia = (primeiro_dia + timedelta(days=32)).replace(day=1) - timedelta(
                seconds=1
            )
        else:
            ultimo_dia = now

        total_mes = db.query(func.sum(Venda.valor)).filter(
            Venda.id_usuario == current_user.id_usuario,
            Venda.data_criacao >= primeiro_dia,
            Venda.data_criacao <= ultimo_dia,
            Venda.status == "fechada",
        ).scalar() or Decimal(0)

        quantidade_mes = (
            db.query(func.count(Venda.id_venda))
            .filter(
                Venda.id_usuario == current_user.id_usuario,
                Venda.data_criacao >= primeiro_dia,
                Venda.data_criacao <= ultimo_dia,
                Venda.status == "fechada",
            )
            .scalar()
            or 0
        )

        # Nome do mês em português
        meses = [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
        ]
        mes_nome = meses[data_ref.month - 1]

        vendas_por_mes.append(
            {"mes": mes_nome, "total": float(total_mes), "quantidade": quantidade_mes}
        )

    # ========================================
    # CALCULAR VARIAÇÕES
    # ========================================
    variacao_vendas = 0
    if vendas_mes_anterior > 0:
        variacao_vendas = (
            (vendas_mes_atual - vendas_mes_anterior) / vendas_mes_anterior * 100
        )
    elif vendas_mes_atual > 0:
        variacao_vendas = 100

    return {
        "vendas_mes_atual": float(vendas_mes_atual),
        "vendas_mes_anterior": float(vendas_mes_anterior),
        "variacao_vendas": round(float(variacao_vendas), 1),
        "total_clientes": total_clientes,
        "total_clientes_mes_anterior": total_clientes_mes_anterior,
        "total_vendas_fechadas": total_vendas_fechadas,
        "conversao_rate": round(conversao_rate, 1),
        "ticket_medio": float(ticket_medio),
        "vendas_por_mes": vendas_por_mes,
        "total_vendas": total_vendas,
    }
