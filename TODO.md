# TODO - Efood-vercel alterações

- [x] Ajustar `src/pages/Checkout/index.tsx`: validação numérica (somente dígitos) e mensagens separadas para entrega vs cartão.
- [x] Garantir POST para `/api/efood/checkout` ao clicar em “Finalizar pedido”.
- [ ] Ajustar uso do id retornado pela API (mapear campo correto) e persistir na confirmação.
- [ ] Atualizar `src/pages/OrderConfirmation/index.tsx` para exibir corretamente os dados da API (incluindo id real).
- [ ] Ajustar `src/components/Cart/index.tsx` para não executar o POST do checkout (fluxo principal via rotas/pages).
- [ ] Atualizar tipos em `src/types/index.ts` se necessário.
- [ ] Testar build local.
- [ ] Fazer deploy na Vercel.
- [ ] Enviar link do projeto publicado.


