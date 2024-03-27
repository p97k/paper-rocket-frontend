type TMessage = {
    content: string
    client_id: string
    username: string
    room_id: string
    type: 'recv' | 'self'
}

export { TMessage }
