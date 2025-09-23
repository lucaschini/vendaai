"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, Download } from "lucide-react"

interface ProcessingResponse {
  status: 'processing' | 'completed' | 'error'
  downloadUrl?: string
  message?: string
}

export default function SubmittedPage() {
  const [status, setStatus] = useState<'processing' | 'completed' | 'error'>('processing')
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    // Simula o polling da API para verificar o status do processamento
    const checkProcessingStatus = async () => {
      try {
        // Substitua pela sua chamada real da API
        const response = await fetch('/api/processing-status')
        const data: ProcessingResponse = await response.json()
        
        setStatus(data.status)
        if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl)
        }
        if (data.message) {
          setMessage(data.message)
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
        setStatus('error')
        setMessage('Erro ao verificar o status do processamento')
      }
    }

    // Verifica o status imediatamente
    checkProcessingStatus()

    // Continua verificando a cada 3 segundos até completar
    const interval = setInterval(() => {
      if (status === 'processing') {
        checkProcessingStatus()
      } else {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [status])

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'processing' && 'Processando...'}
            {status === 'completed' && 'Processamento Concluído!'}
            {status === 'error' && 'Erro no Processamento'}
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'Aguarde enquanto processamos seus arquivos'}
            {status === 'completed' && 'Seus arquivos foram processados com sucesso'}
            {status === 'error' && 'Ocorreu um erro durante o processamento'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === 'processing' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Este processo pode levar alguns minutos...
              </p>
            </div>
          )}

          {status === 'completed' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message || 'Arquivos processados com sucesso!'}
              </p>
              <Button 
                onClick={handleDownload}
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Resultado
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                {message || 'Erro durante o processamento'}
              </p>
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}