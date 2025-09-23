export async function submitFormData(formData: FormData): Promise<void> {
  try {
    const response = await fetch("http://localhost:8000/processa-publi", {
      method: "POST",
      body: formData,
      // Note: Não definimos Content-Type quando enviamos FormData
      // O browser define automaticamente com o boundary correto
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Se a API retornar JSON, você pode processar aqui
    // const result = await response.json();
    // return result;

  } catch (error) {
    console.error("Erro ao enviar formulário:", error);
    throw new Error("Falha ao enviar o formulário. Tente novamente.");
  }
}