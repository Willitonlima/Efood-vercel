import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setConfirmation, setLoading, setError } from '../../store/orderSlice'
import { clearCart } from '../../store/cartSlice'
import { HeaderPerfil as Header } from '../../components/Header'
import Footer from '../../components/Footer'
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

const Main = styled.main`
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 40px;
`

const Section = styled.div`
  background: #E66767;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
`

const SectionTitle = styled.h2`
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
`

const Row = styled.div<{ cols?: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.cols || '1fr'};
  gap: 12px;
  margin-bottom: 12px;
`

const Label = styled.label`
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
  font-family: 'Roboto', sans-serif;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 2px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  outline: none;
  color: #333;
`

const SubmitBtn = styled.button`
  width: 100%;
  background: #FFEBD9;
  color: #E66767;
  border: none;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  margin-top: 8px;
  &:hover { background: white; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const ErrorMsg = styled.p`
  color: white;
  background: rgba(0,0,0,0.15);
  padding: 10px;
  border-radius: 2px;
  margin-top: 10px;
  font-size: 13px;
  font-family: 'Roboto', sans-serif;
`

import { onlyDigits, clampDigits, formatCardNumber } from '../../utils/formatters'

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items } = useAppSelector((s) => s.cart)
  const { loading, error } = useAppSelector((s) => s.order)


  const [form, setForm] = useState<FormState>({
    receiver: '', address: '', city: '', zipCode: '',
    number: '', complement: '', cardName: '', cardNumber: '',
    cardCode: '', expiresMonth: '', expiresYear: '',
  })

  const [deliveryError, setDeliveryError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((f) => {
      switch (name) {
        case 'zipCode':
          return { ...f, zipCode: clampDigits(value, 8) }
        case 'number':
          return { ...f, number: onlyDigits(value) }
        case 'cardNumber':
          return { ...f, cardNumber: formatCardNumber(value) }
        case 'cardCode':
          return { ...f, cardCode: clampDigits(value, 3) }
        case 'expiresMonth':
          return { ...f, expiresMonth: clampDigits(value, 2) }
        case 'expiresYear':
          return { ...f, expiresYear: clampDigits(value, 4) }
        default:
          return { ...f, [name]: value }
      }
    })

    setDeliveryError(null)
    setPaymentError(null)
    dispatch(setError(''))
  }

  const validateDelivery = () => {
    if (!form.receiver.trim()) return 'Verifique: nome do destinatário é obrigatório.'
    if (!form.address.trim()) return 'Verifique: endereço é obrigatório.'
    if (!form.city.trim()) return 'Verifique: cidade é obrigatória.'
    if (!form.zipCode || form.zipCode.length < 8) return 'Verifique: CEP deve conter 8 dígitos.'
    if (!form.number || form.number.length < 1) return 'Verifique: número do endereço é obrigatório.'
    return null
  }

  const validatePayment = () => {
    if (!form.cardName.trim()) return 'Verifique: nome no cartão é obrigatório.'
    const cardDigits = onlyDigits(form.cardNumber)
    if (!cardDigits || cardDigits.length < 13) return 'Verifique: número do cartão deve conter dígitos válidos.'
    if (!form.cardCode || form.cardCode.length !== 3) return 'Verifique: CVV deve conter 3 dígitos.'
    if (!form.expiresMonth || form.expiresMonth.length !== 2) return 'Verifique: mês deve conter 2 dígitos.'
    if (!form.expiresYear || form.expiresYear.length !== 4) return 'Verifique: ano deve conter 4 dígitos.'
    return null
  }

  const handleSubmit = async () => {
    setDeliveryError(null)
    setPaymentError(null)

    if (items.length === 0) {
      dispatch(setError('Carrinho vazio.'))
      return
    }

    const dErr = validateDelivery()
    if (dErr) {
      setDeliveryError(dErr)
      return
    }

    const pErr = validatePayment()
    if (pErr) {
      setPaymentError(pErr)
      return
    }

    dispatch(setLoading(true))
    dispatch(setError(''))

    try {
      const body = {
        products: items.map((i) => ({ id: i.id, price: i.preco })),
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
            number: onlyDigits(form.cardNumber),
            code: Number(form.cardCode),
            expires: {
              month: Number(form.expiresMonth),
              year: Number(form.expiresYear),
            },
          },
        },
      }

      const res = await fetch('https://api-ebac.vercel.app/api/efood/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      // Back-end deve decidir a validação final; aqui salvamos o que ele responder.
      dispatch(setConfirmation(data))
      dispatch(clearCart())
      navigate('/confirmacao')
    } catch {
      dispatch(setError('Erro ao processar o pedido. Tente novamente.'))
    }
  }


  return (
    <>
      <Header />
      <Main>
        <Section>
          <SectionTitle>Entrega</SectionTitle>
          <Row>
            <div>
              <Label>Quem irá receber</Label>
              <Input name="receiver" value={form.receiver} onChange={handleChange} placeholder="Nome completo" />
            </div>
          </Row>
          <Row>
            <div>
              <Label>Endereço</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Rua, Avenida..." />
            </div>
          </Row>
          <Row cols="1fr 1fr">
            <div>
              <Label>Cidade</Label>
              <Input name="city" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <Label>CEP</Label>
              <Input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="00000-000" />
            </div>
          </Row>
          <Row cols="80px 1fr">
            <div>
              <Label>Número</Label>
              <Input name="number" value={form.number} onChange={handleChange} />
            </div>
            <div>
              <Label>Complemento (opcional)</Label>
              <Input name="complement" value={form.complement} onChange={handleChange} />
            </div>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Pagamento – Cartão de crédito</SectionTitle>
          <Row>
            <div>
              <Label>Nome no cartão</Label>
              <Input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Como está impresso no cartão" />
            </div>
          </Row>
          <Row cols="3fr 1fr">
            <div>
              <Label>Número do cartão</Label>
              <Input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" maxLength={19} />
            </div>
            <div>
              <Label>CVV</Label>
              <Input name="cardCode" value={form.cardCode} onChange={handleChange} placeholder="000" maxLength={3} />
            </div>
          </Row>
          <Row cols="1fr 1fr">
            <div>
              <Label>Mês de vencimento</Label>
              <Input name="expiresMonth" value={form.expiresMonth} onChange={handleChange} placeholder="MM" maxLength={2} />
            </div>
            <div>
              <Label>Ano de vencimento</Label>
              <Input name="expiresYear" value={form.expiresYear} onChange={handleChange} placeholder="AAAA" maxLength={4} />
            </div>
          </Row>
          {deliveryError && <ErrorMsg>{deliveryError}</ErrorMsg>}
          {paymentError && <ErrorMsg>{paymentError}</ErrorMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitBtn onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processando...' : 'Finalizar pedido'}
          </SubmitBtn>
        </Section>
      </Main>
      <Footer />
    </>
  )
}

export default Checkout
