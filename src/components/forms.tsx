"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { CloudUpload, Paperclip, Loader2 } from "lucide-react"
import { submitFormData } from "@/actions/forms_submit"

// ⚠️ Importante: como estamos enviando arquivos, o schema precisa aceitar File/File[]
const formSchema = z.object({
  area: z.string().min(1, "Escolha uma área"),
  // múltiplos arquivos
  planilhas_publicacao: z.array(z.instanceof(File)).min(1, "Envie pelo menos um arquivo"),
  // um arquivo único
  upload_lo: z.instanceof(File, { message: "Envie o arquivo do Legal One" }),
})

type FormValues = z.infer<typeof formSchema>

export default function FormEnvio() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: "",
      planilhas_publicacao: [],
      upload_lo: undefined as unknown as File,
    },
    mode: "onSubmit",
  })

  // watchers para exibir os nomes dos arquivos
  const pubFiles = form.watch("planilhas_publicacao")
  const loFile = form.watch("upload_lo")
  const area = form.watch("area")

  // pequenos memos só para renderizar listas de nomes
  const pubFileNames = useMemo(
    () => (pubFiles ?? []).map((f) => f.name),
    [pubFiles]
  )
  const loFileName = useMemo(
    () => (loFile ? loFile.name : ""),
    [loFile]
  )

  // Verifica se todos os campos estão preenchidos
  const isFormValid = useMemo(() => {
    return (
      area && 
      area.length > 0 && 
      pubFiles && 
      pubFiles.length > 0 && 
      loFile
    )
  }, [area, pubFiles, loFile])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    
    try {
      const fd = new FormData()
      fd.append("area", values.area)
      
      // Múltiplos arquivos - cada um em campo separado
      values.planilhas_publicacao.forEach((file, index) => {
        fd.append("planilhas_publicacao", file)
      })
      
      // Arquivo único
      fd.append("upload_lo", values.upload_lo)

      // Mostra toast de processamento
      toast.loading("Enviando formulário...", { id: "form-submit" })

      // Chama a função de envio
      await submitFormData(fd)

      toast.success("Formulário enviado com sucesso!", { id: "form-submit" })
      
      // Reset do formulário após sucesso
      form.reset()
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Falhou ao enviar o formulário. Tente novamente.", { id: "form-submit" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Título e descrição adicionados */}
      <div className="max-w-3xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-2">Automação de publicações</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Preencha o forms com as informações necessárias e clique em enviar
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-4"
          encType="multipart/form-data"
        >
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="civel">Cível</SelectItem>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload múltiplo: planilhas da publicação */}
          <FormField
            control={form.control}
            name="planilhas_publicacao"
            render={() => (
              <FormItem>
                <FormLabel>Selecione as planilhas da publicação:</FormLabel>
                <FormControl>
                  <div className="rounded-lg border border-dashed p-4">
                    <label
                      htmlFor="planilhas_publicacao"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 py-8 text-center"
                    >
                      <CloudUpload className="h-10 w-10 text-gray-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Aceita: XLSX, XLS
                      </div>
                    </label>

                    <Input
                      id="planilhas_publicacao"
                      type="file"
                      className="hidden"
                      multiple
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? [])
                        form.setValue("planilhas_publicacao", files, { shouldValidate: true })
                      }}
                    />

                    {pubFileNames.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {pubFileNames.map((name, i) => (
                          <li
                            key={`${name}-${i}`}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="truncate">{name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Coloque aqui as planilhas baixadas das fontes de publicação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload único: planilha do Legal One */}
          <FormField
            control={form.control}
            name="upload_lo"
            render={() => (
              <FormItem>
                <FormLabel>Selecione a planilha das pastas do Legal One</FormLabel>
                <FormControl>
                  <div className="rounded-lg border border-dashed p-4">
                    <label
                      htmlFor="upload_lo"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 py-8 text-center"
                    >
                      <CloudUpload className="h-10 w-10 text-gray-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Aceita: XLSX, XLS
                      </div>
                    </label>

                    <Input
                      id="upload_lo"
                      type="file"
                      className="hidden"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(e) => {
                        const file = (e.target.files && e.target.files[0]) || undefined
                        if (file) {
                          form.setValue("upload_lo", file, { shouldValidate: true })
                        }
                      }}
                    />

                    {loFileName && (
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <Paperclip className="h-4 w-4" />
                        <span className="truncate">{loFileName}</span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Coloque aqui a planilha que se refere às pastas do Legal One
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="cursor-pointer" 
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
