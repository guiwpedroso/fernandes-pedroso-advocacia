# Fernandes Pedroso Advocacia

Landing page institucional do escritório **Fernandes Pedroso Advocacia** (Matão-SP), desenvolvida com foco em clareza, desempenho, acessibilidade e conversão direta para atendimento via WhatsApp.

🔗 **Site publicado:** https://fernandes-pedroso-advocacia.vercel.app/

## Stack

- **HTML5**, **CSS3** e **JavaScript (ES Modules)** puro
- **Vite** para desenvolvimento e build estático (pronto para Vercel / Netlify)

## Estrutura principal

- `index.html` — página principal
- `politica-de-privacidade.html` — política de privacidade (LGPD)
- `src/site.config.js` — dados centralizados do escritório, textos, links de WhatsApp e controle de movimento (`motion`)
- `src/styles.css` — paleta, tipografia (*Cormorant Garamond* + *Inter*) e layout responsivo
- `src/main.js` — acordeões, seletor de situações, horário de atendimento em tempo real, scrollspy e gerenciamento lazy de vídeos
- `public/assets/` — imagens, logos e vídeos otimizados

## Como rodar localmente

```bash
npm install
npm run dev
```

Para gerar o build de produção:

```bash
npm run build
npm run preview
```
