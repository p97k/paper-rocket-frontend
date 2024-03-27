import { useState, useRef, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import autosize from 'autosize'
import { WebsocketContext } from "../../../modules/websocket_provider";
import {API_URL, WEBSOCKET_URL} from "../../../constants";
import { AuthContext } from "../../../modules/auth_provider";
import {CustomButton} from "../../atoms/CustomButton";
import { TMessage } from "../../../utils/globalTypes/message";
import {ChatBody} from "../../organism/ChatBody";
import {UserList} from "../../organism/UserList";

const Room = () => {
    const [messages, setMessage] = useState<Array<TMessage>>([])
    const textarea = useRef<HTMLTextAreaElement>(null)
    const { conn, setConn } = useContext(WebsocketContext)
    const [users, setUsers] = useState<Array<{ id: string; username: string }>>([])
    const { user } = useContext(AuthContext)

    const router = useRouter()

    useEffect(() => {
        if (conn === null) {
            router.push('/')
            return
        }

        const roomId = conn.url.split('/')[5]
        async function getUsers() {
            try {
                const res = await fetch(`${API_URL}/ws/get-clients/${roomId}/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await res.json()
                console.log({data})

                setUsers(data?.data)
            } catch (e) {
                console.error(e)
            }
        }
        getUsers()
    }, [])

    useEffect(() => {
        if (textarea.current) {
            autosize(textarea.current)
        }

        if (conn === null) {
            router.push('/')
            return
        }

        conn.onmessage = (message) => {
            const m: TMessage = JSON.parse(message.data)
            if (m.content == 'new user has joined the room') {
                setUsers([...users, { username: m.username, id: m.client_id }])
            }

            if (m.content == 'user left the room') {
                const deleteUser = users.filter((user) => user.username != m.username)
                setUsers([...deleteUser])
                setMessage([...messages, m])
                return
            }

            user?.username == m.username ? (m.type = 'self') : (m.type = 'recv')
            setMessage([...messages, m])
        }

        conn.onclose = () => {}
        conn.onerror = () => {}
        conn.onopen = () => {}
    }, [textarea, messages, conn, users])

    const sendMessage = () => {
        if (!textarea.current?.value) return
        if (conn === null) {
            router.push('/')
            return
        }

        conn.send(textarea.current.value)
        textarea.current.value = ''
    }

    const leaveRoom = () => {
        if (conn === null) {
            return
        }

        const roomId = conn.url.split('/')[5]
        const ws = new WebSocket(
            `${WEBSOCKET_URL}/ws/leave-room/${roomId}/?userId=${user.id}&username=${user.username}`
        )
        setConn(ws);
        router.replace("/");
    }

    const handleEnterPressed = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
      }
    }

    useEffect(() => {
        window?.addEventListener('beforeunload', leaveRoom);

        return () => {
            window?.removeEventListener('beforeunload', leaveRoom);
        };
    }, []);

    return (
        <>
            <div className='flex flex-col w-full'>
                <div className='flex'>
                    <div className='p-4 mb-14 w-4/5'>
                        <ChatBody data={messages} />
                    </div>
                    <div className='w-1/5'>
                        <UserList users={users} />
                    </div>
                </div>
                <div className='fixed bottom-0 mt-4 w-full'>
                    <div className='flex md:flex-row px-4 py-2 bg-primary-mid-dark'>
                        <div className='flex items-center'>
                            <CustomButton
                                styles='p-2 rounded-md bg-red text-white'
                                onClick={leaveRoom}
                                text="Leave"
                                type="button"
                            />
                        </div>
                        <div className='flex w-full mr-4 ml-4 rounded-md border border-blue text-primary'>
                              <textarea
                                  ref={textarea}
                                  onKeyDown={handleEnterPressed}
                                  placeholder='Type your message here ...'
                                  className='w-full h-10 p-2 rounded-md focus:outline-none'
                                  style={{ resize: 'none' }}
                              />
                        </div>
                        <div className='flex items-center'>
                            <CustomButton
                                styles='p-2 rounded-md bg-blue text-white'
                                onClick={sendMessage}
                                text="Send"
                                type="button"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export { Room };
