export default function handler(event: any) {
  event.node.res.statusCode = 200
  event.node.res.setHeader('content-type', 'application/json')
  event.node.res.end(JSON.stringify({ status: 'ok' }))
}
