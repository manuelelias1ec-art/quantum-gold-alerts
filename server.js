const express = require('express')
const axios   = require('axios')
const app     = express()
app.use(express.json())

const WA_PHONE  = process.env.WA_PHONE
const WA_APIKEY = process.env.WA_APIKEY

app.post('/webhook', async (req, res) => {
  try {
    const data   = req.body
    const precio = parseFloat(data.precio).toFixed(2)
    const hora   = new Date().toLocaleTimeString('es-CO', {timeZone:'America/Bogota'})
    let msg = ''

    if (data.tipo === 'LONG') {
      msg = '⚡ QUANTUM GOLD\n▲ ENTRAR LONG\n💰 Precio: $' + precio + '\n⏰ ' + hora + ' COL\n✅ Verificar SL/TP en TradingView'
    } else if (data.tipo === 'SHORT') {
      msg = '⚡ QUANTUM GOLD\n▼ ENTRAR SHORT\n💰 Precio: $' + precio + '\n⏰ ' + hora + ' COL\n✅ Verificar SL/TP en TradingView'
    } else if (data.tipo === 'PRE_LONG') {
      msg = '◆ PREPARAR LONG\n💰 $' + precio + ' | ' + hora + '\nEspera confirmación'
    } else if (data.tipo === 'PRE_SHORT') {
      msg = '◆ PREPARAR SHORT\n💰 $' + precio + ' | ' + hora + '\nEspera confirmación'
    } else if (data.tipo === 'NUBE_MUERTA') {
      msg = '⛔ NUBE MUERTA\nSuspender operaciones en ' + data.ticker
    } else if (data.tipo === 'LIMITE_DIA') {
      msg = '🛑 LÍMITE DIARIO\nCierra las pantallas. Día terminado.'
    } else if (data.tipo === 'TRAMPA') {
      msg = '🔥 TRAMPA DETECTADA\n$' + precio + ' | ' + hora + '\nOportunidad alta — revisa dashboard'
    }

    await axios.get('https://api.callmebot.com/whatsapp.php', {
      params: { phone: WA_PHONE, text: msg, apikey: WA_APIKEY }
    })

    console.log('[' + hora + '] Alerta enviada: ' + data.tipo)
    res.json({ ok: true })
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ ok: false, error: err.message })
  }
})

app.get('/', (req, res) => res.send('Quantum Gold PRO — servidor activo ✅'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT))
