# Entrega Global Solution - Levi Ochi dos Santos / 551044

## App Foco & Humor

Mini app com duas funções:
- Timer de foco (ajuste de duração, iniciar/pausar, reset e barra de progresso)
- Check-in de humor (cinco opções, registro em lista, sem login)

Eixo temático: Sociedade 5.0 — Equilíbrio entre produtividade e bem‑estar.

## Rodando sem instalar nada (Snack)

1) Acesse https://snack.expo.dev/
2) Clique em “New Snack”
3) No painel de arquivos, abra App.js e substitua TODO o conteúdo pelo código fornecido
4) Clique em “Run”
   - Aba “Web”: roda direto no navegador
   - QR Code: instale o app “Expo Go” no celular e escaneie o QR para rodar no telefone

Demonstração rápida:
- Aba Timer: ajuste a duração (-5, -1, +1, +5), toque em “Iniciar”; no zero, o aparelho vibra
- Aba Humor: selecione um humor e toque “Registrar”; veja a lista de registros

## Rodando localmente (opcional)

Pré-requisitos:
- Node.js LTS (https://nodejs.org)
- Expo CLI (via npx, já vem com Node)

Passos:
```bash
npx create-expo-app foco-humor
cd foco-humor
# Abra o projeto no editor e substitua o conteúdo do arquivo App.js pelo código fornecido
npx expo start