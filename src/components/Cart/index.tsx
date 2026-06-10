import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearCartKeepOpen, closeCart, removeItem } from '../../store/cartSlice'
import { setConfirmation, setError, setLoading } from '../../store/orderSlice'

/* ---- Animations ---- */
const slideIn = keyframes`from{transform:translateX(100%)}to{transform:translateX(0)}`

/* ---- Layout ---- */
const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 900;
`

const Drawer = styled.div`
  position: fixed;
  top: 0; right: 0;
  width: 360px;
  height: 100vh;
  background: #E66767;
  z-index: 901;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  padding: 0 0 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

/* ---- Header ---- */
const Header = styled.div`
  padding: 32px 8px 16px;
`

const HeaderTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #FFEBD9;
  margin-bottom: 16px;
  font-family: 'Roboto', sans-serif;
`

/* ---- Empty message ---- */
const EmptyMsg = styled.p`
  color: #FFEBD9;
  text-align: center;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`

/* ---- Item Row ---- */
const ItemRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 344px;
  min-height: 100px;
  background: #FFEBD9;
  padding: 8px 8px 12px 8px;
  margin: 0 auto 16px;
  color: #E66767;
`

const ItemImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  flex-shrink: 0;
`

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const ItemName = styled.p`
  font-size: 18px;
  font-weight: 900;
  color: #E66767;
  margin-bottom: 16px;
  font-family: 'Roboto', sans-serif;
  line-height: 1.2;
`

const ItemPrice = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #E66767;
  font-family: 'Roboto', sans-serif;
`

/* ---- Trash icon ---- */
const TrashBtn = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover svg path {
    fill: #b34a4a;
  }
`

/* ---- Bottom ---- */
const BottomSection = styled.div`
  background: #E66767;
  padding: 40px 8px 16px;
  margin-top: auto;
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const TotalLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #FFEBD9;
  font-family: 'Roboto', sans-serif;
`

const TotalValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #FFEBD9;
  font-family: 'Roboto', sans-serif;
`

const ContinueBtn = styled.button`
  width: 100%;
  background: #FFEBD9;
  color: #E66767;
  border: none;
  padding: 4px 6px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  &:hover { background: #fff; }
`

/* ---- Checkout forms ---- */
const Section = styled.div`
  padding: 0 8px 16px;
  margin-bottom: 16px;
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #FFEBD9;
  margin-bottom: 16px;
  font-family: 'Roboto', sans-serif;
`

const Fieldset = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 8px;
`

const Label = styled.label`
  color: #FFEBD9;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
  display: block;
  font-family: 'Roboto', sans-serif;
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 0;
  background: #FFEBD9;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  color: #4A4A4A;
`

const InputGroup = styled.div`
  display: flex;
  gap: 34px;

  & > * {
    flex: 1;
  }
`

const ErrorMsg = styled.p`
  color: #FFEBD9;
  font-size: 12px;
  margin: 8px 0;
  font-family: 'Roboto', sans-serif;
`

const PrimaryBtn = styled(ContinueBtn)`
  margin-bottom: 8px;
`

const SecondaryBtn = styled(ContinueBtn)``

/* ---- Success ---- */
const SuccessCard = styled.div`
  padding: 0 8px;
`

const SuccessTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #FFEBD9;
  margin-bottom: 16px;
  font-family: 'Roboto', sans-serif;
`

const SuccessParagraph = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.57;
  color: #FFEBD9;
  font-family: 'Roboto', sans-serif;
`

/* ============================================================
   Trash icon SVG component (Figma original)
   ============================================================ */
const TrashIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 3.5H11.5V2.5C11.5 1.95 11.05 1.5 10.5 1.5H5.5C4.95 1.5 4.5 1.95 4.5 2.5V3.5H2C1.725 3.5 1.5 3.725 1.5 4C1.5 4.275 1.725 4.5 2 4.5H2.5V13C2.5 13.825 3.175 14.5 4 14.5H12C12.825 14.5 13.5 13.825 13.5 13V4.5H14C14.275 4.5 14.5 4.275 14.5 4C14.5 3.725 14.275 3.5 14 3.5ZM5.5 2.5H10.5V3.5H5.5V2.5ZM12.5 13C12.5 13.275 12.275 13.5 12 13.5H4C3.725 13.5 3.5 13.275 3.5 13V4.5H12.5V13ZM5.5 5.5V12.5H6.5V5.5H5.5ZM7.5 5.5V12.5H8.5V5.5H7.5ZM9.5 5.5V12.5H10.5V5.5H9.5Z"
      fill="#E66767"
    />
  </svg>
)

/* ============================================================
   Component
   ============================================================ */
interface FormState {
  receiver: string
  address: string
  city: string
  zipCode: string
  number: string
  complement: string
  cardName: string
  cardNumber: string
  cardCode: string
  expiresMonth: string
  expiresYear: string
}

const Cart: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isOpen, items } = useAppSelector((s) => s.cart)
  const { loading, error } = useAppSelector((s) => s.order)
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [form, setForm] = useState<FormState>({
    receiver: '', address: '', city: '', zipCode: '',
    number: '', complement: '', cardName: '', cardNumber: '',
    cardCode: '', expiresMonth: '', expiresYear: '',
  })

  if (!isOpen) return null

  const total = items.reduce((acc, item) => acc + item.preco * item.quantity, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.receiver || !form.address || !form.cardName || !form.cardNumber || !form.cardCode || !form.expiresMonth || !form.expiresYear) {
      dispatch(setError('Preencha todos os campos obrigatórios.'))
      return
    }
    if (items.length === 0) {
      dispatch(setError('O carrinho está vazio.'))
      return
    }

    dispatch(setLoading(true))
    try {
      const products = items.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({ id: item.id, price: item.preco }))
      )

      const res = await fetch('https://api-ebac.vercel.app/api/efood/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products,
          delivery: {
            receiver: form.receiver,
            address: {
              description: form.address,
              city: form.city,
              zipCode: form.zipCode,
              number: Number(form.number),
              complement: form.complement,
            },
          },
          payment: {
            card: {
              name: form.cardName,
              number: form.cardNumber,
              code: Number(form.cardCode),
              expires: {
                month: Number(form.expiresMonth),
                year: Number(form.expiresYear),
              },
            },
          },
        }),
      })
      const data = await res.json()
      dispatch(setConfirmation(data))
      dispatch(clearCartKeepOpen())
      setOrderSuccess(true)
      setCheckoutMode(false)
    } catch {
      dispatch(setError('Erro ao processar o pedido. Tente novamente.'))
    }
  }

  const handleClose = () => {
    dispatch(closeCart())
    setCheckoutMode(false)
    setCheckoutStep(1)
    setOrderSuccess(false)
    dispatch(setError(''))
  }

  return (
    <>
      <Overlay onClick={handleClose} />
      <Drawer>
        {orderSuccess ? (
          <Content>
            <Header>
              <HeaderTitle>Pedido realizado - código 0001</HeaderTitle>
            </Header>
            <SuccessCard>
              <SuccessParagraph>
                Estamos felizes em informar que seu pedido já está em processo de preparação e, em breve, será entregue no endereço fornecido.
              </SuccessParagraph>
              <SuccessParagraph>
                Gostaríamos de ressaltar que nossos entregadores não estão autorizados a realizar cobranças extras.
              </SuccessParagraph>
              <SuccessParagraph>
                Lembre-se da importância de higienizar as mãos após o recebimento do pedido, garantindo assim sua segurança e bem-estar durante a refeição.
              </SuccessParagraph>
              <SuccessParagraph>
                Esperamos que desfrute de uma deliciosa e agradável experiência gastronômica. Bom apetite!
              </SuccessParagraph>
              <ContinueBtn style={{ marginTop: 24, padding: '4px 6px', fontWeight: 700, fontSize: 14, background: '#FFEBD9', color: '#E66767' }} onClick={handleClose}>
                Concluir
              </ContinueBtn>
            </SuccessCard>
          </Content>
        ) : items.length === 0 ? (
          <Content>
            <Header>
              <HeaderTitle>Carrinho vazio</HeaderTitle>
            </Header>
            <EmptyMsg>Adicione itens ao carrinho para continuar.</EmptyMsg>
          </Content>
        ) : checkoutMode ? (
          <Content>
            <Header>
              <HeaderTitle>
                {checkoutStep === 1 ? 'Entrega' : `Pagamento - Valor a pagar R$ ${total.toFixed(2).replace('.', ',')}`}
              </HeaderTitle>
            </Header>

            {checkoutStep === 1 ? (
              <Section>
                <SectionTitle>Dados de entrega</SectionTitle>
                <Fieldset>
                  <Label>Quem irá receber</Label>
                  <Input name="receiver" value={form.receiver} onChange={handleChange} />
                </Fieldset>
                <Fieldset>
                  <Label>Endereço</Label>
                  <Input name="address" value={form.address} onChange={handleChange} />
                </Fieldset>
                <Fieldset>
                  <Label>Cidade</Label>
                  <Input name="city" value={form.city} onChange={handleChange} />
                </Fieldset>
                <InputGroup>
                  <Fieldset>
                    <Label>CEP</Label>
                    <Input name="zipCode" value={form.zipCode} onChange={handleChange} />
                  </Fieldset>
                  <Fieldset>
                    <Label>Número</Label>
                    <Input name="number" value={form.number} onChange={handleChange} />
                  </Fieldset>
                </InputGroup>
                <Fieldset>
                  <Label>Complemento (opcional)</Label>
                  <Input name="complement" value={form.complement} onChange={handleChange} />
                </Fieldset>

                <PrimaryBtn onClick={() => setCheckoutStep(2)}>
                  Continuar com o pagamento
                </PrimaryBtn>
                <SecondaryBtn onClick={() => setCheckoutMode(false)}>
                  Voltar para o carrinho
                </SecondaryBtn>
              </Section>
            ) : (
              <Section>
                <SectionTitle>Dados de pagamento</SectionTitle>

                <Fieldset>
                  <Label>Nome no cartão</Label>
                  <Input name="cardName" value={form.cardName} onChange={handleChange} />
                </Fieldset>

                <InputGroup>
                  <Fieldset>
                    <Label>Número do cartão</Label>
                    <Input name="cardNumber" value={form.cardNumber} onChange={handleChange} maxLength={19} />
                  </Fieldset>
                  <Fieldset>
                    <Label>CVV</Label>
                    <Input name="cardCode" value={form.cardCode} onChange={handleChange} maxLength={3} style={{ width: '100%' }} />
                  </Fieldset>
                </InputGroup>

                <InputGroup>
                  <Fieldset>
                    <Label>Mês de vencimento</Label>
                    <Input name="expiresMonth" value={form.expiresMonth} onChange={handleChange} maxLength={2} />
                  </Fieldset>
                  <Fieldset>
                    <Label>Ano de vencimento</Label>
                    <Input name="expiresYear" value={form.expiresYear} onChange={handleChange} maxLength={4} />
                  </Fieldset>
                </InputGroup>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                <PrimaryBtn onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Processando...' : 'Finalizar pagamento'}
                </PrimaryBtn>
                <SecondaryBtn onClick={() => setCheckoutStep(1)}>
                  Voltar para a edição de endereço
                </SecondaryBtn>
              </Section>
            )}
          </Content>
        ) : (
          <>
            <Content>
              <Header>
                <HeaderTitle>Carrinho</HeaderTitle>
              </Header>
              {items.map((item) => (
                <ItemRow key={item.cartItemId}>
                  {item.foto && <ItemImg src={item.foto} alt={item.nome} />}
                  <ItemInfo>
                    <ItemName>{item.nome}</ItemName>
                    <ItemPrice>R$ {item.preco.toFixed(2).replace('.', ',')}</ItemPrice>
                  </ItemInfo>
                  <TrashBtn
                    onClick={() => dispatch(removeItem(item.cartItemId))}
                    aria-label={`Remover ${item.nome}`}
                  >
                    <TrashIcon />
                  </TrashBtn>
                </ItemRow>
              ))}
            </Content>
            <BottomSection>
              <TotalRow>
                <TotalLabel>Valor total</TotalLabel>
                <TotalValue>R$ {total.toFixed(2).replace('.', ',')}</TotalValue>
              </TotalRow>
              <ContinueBtn onClick={() => { dispatch(setError('')); setCheckoutMode(true) }}>
                Continuar com a entrega
              </ContinueBtn>
            </BottomSection>
          </>
        )}
      </Drawer>
    </>
  )
}

export default Cart
