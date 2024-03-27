import { useState, useContext, useEffect, SyntheticEvent } from 'react'
import { useRouter } from 'next/router'
import { AuthContext, UserInfo } from "../../../modules/auth_provider";
import { API_URL } from "../../../constants";
import { CustomButton } from "../../atoms/CustomButton";
import { CustomInput } from "../../atoms/CustomInput";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { authenticated, setAuthenticated } = useContext(AuthContext)

    const router = useRouter()

    useEffect(() => {
        if (authenticated) {
            router.push('/')
            return
        }
    }, [authenticated])

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`${API_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (res.ok) {
                const user: UserInfo = {
                    username: data?.data.username,
                    id: data?.data.id,
                }

                localStorage.setItem('user_info', JSON.stringify(user))
                setAuthenticated(true);
                return router.push('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex items-center justify-center min-w-full min-h-screen'>
            <form className='flex flex-col md:w-1/5'>
                <div className='text-2xl font-bold text-center'>
                    <span className='text-blue'>Welcome to Paper Rocket!</span>
                </div>
                <CustomInput
                    type="email"
                    placeholder='email'
                    style='p-3 mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-blue text-primary'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <CustomInput
                    type='password'
                    placeholder='password'
                    style='p-3 mt-4 rounded-md border-2 border-grey focus:outline-none focus:border-blue text-primary'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <CustomButton
                    styles='p-3 mt-6 rounded-md bg-blue font-bold text-white'
                    type='submit'
                    onClick={submitHandler}
                    text="login"
                />
                <div className="text-sm flex justify-center space-x-3 mt-2">
                    <span>not have account yet?</span>
                    <span className="text-blue cursor-pointer" onClick={() => router.push("/signup")}>create account</span>
                </div>
            </form>
        </div>
    )
}

export { Login }
