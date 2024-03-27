import {useState, useEffect, useContext, SyntheticEvent} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { CustomButton } from "../../atoms/CustomButton";
import { CustomInput } from "../../atoms/CustomInput";
import { WEBSOCKET_URL, API_URL } from "../../../constants";
import { AuthContext } from "../../../modules/auth_provider";
import { WebsocketContext } from "../../../modules/websocket_provider";

const Home = () => {
    const [rooms, setRooms] = useState<{ id: string; name: string }[]>([])
    const [roomName, setRoomName] = useState('')
    const { user, authenticated, setAuthenticated } = useContext(AuthContext)
    const { setConn } = useContext(WebsocketContext)


    const router = useRouter()

    const getRooms = async () => {
        try {
            const res = await fetch(`${API_URL}/ws/get-room/`, {
                method: 'GET',
            })

            const data = await res.json()
            if (res.ok) {
                setRooms(data?.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        console.log(authenticated)
        if (!authenticated) {
            router.push("/login");
            return;
        }
        getRooms();
    }, [authenticated])

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API_URL}/ws/create-room/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: uuidv4(),
                    name: roomName,
                }),
            })

            if (res.ok) {
                setRoomName('');
                getRooms();
            }
        } catch (err) {
            console.log(err)
        }
    }

    const joinRoom = (roomId: string) => {
        const ws = new WebSocket(
            `${WEBSOCKET_URL}/ws/join-room/${roomId}/?userId=${user.id}&username=${user.username}`
        )
        if (ws.OPEN) {
            setConn(ws)
            router.push('/room')
            return
        }
    }

    const handleLogout = async (e: SyntheticEvent) => {
        if (authenticated) {
            e.preventDefault();
            try {
                const res = await fetch(`${API_URL}/logout/`, {
                    method: 'GET',
                })

                if (res.ok) {
                    localStorage.removeItem('user_info')
                    setAuthenticated(false);
                    return  router.replace('/login')
                }
            } catch (err) {
                console.log(err)
            }
        }
    };

    return (
        <>
            {authenticated &&
                <CustomButton
                    styles="absolute bg-red text-white p-2 m-2 rounded-md"
                    onClick={handleLogout}
                    type="button"
                    text="Logout"
                />
            }
            <div className='my-8 px-4 md:mx-32 w-full h-full'>
                <div className='flex justify-center mt-3 p-5'>
                    <CustomInput
                        type='text'
                        style='border border-grey p-2 rounded-md focus:outline-none focus:border-blue text-primary'
                        placeholder='Room Name'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <CustomButton
                        styles='bg-blue text-white rounded-md p-2 md:ml-4'
                        onClick={submitHandler}
                        text="Create Room"
                        type="button"
                    />
                </div>
                <div className='mt-6'>
                    <div className='font-bold'>Available Rooms</div>
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-6'>
                        {rooms?.map((room) => (
                            <div
                                key={room.id}
                                className='border border-blue p-5 flex items-center rounded-md w-96'
                            >
                                <div className='w-full'>
                                    <div className='text-sm'>Room</div>
                                    <div className='text-blue font-bold text-lg'>{room.name}</div>
                                </div>
                                <div className=''>
                                    <CustomButton
                                        styles='px-4 py-2 text-white bg-blue rounded-md'
                                        onClick={() => joinRoom(room.id)}
                                        type="button"
                                        text="Join"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export { Home };
