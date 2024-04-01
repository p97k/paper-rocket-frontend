import {SyntheticEvent, useState} from "react";
import {useRouter} from "next/router";
import {API_URL} from "../../../constants";
import {CustomInput} from "../../atoms/CustomInput";
import {CustomButton} from "../../atoms/CustomButton";

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`${API_URL}/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })

            if (res.ok) {
                return router.push('/login')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex items-center justify-center min-w-full min-h-screen'>
            <form className='flex flex-col md:w-1/5'>
                <div className='text-lg font-bold text-center'>
                    <span className='text-blue'>Create Account in Paper Rocket!</span>
                </div>
                <CustomInput
                    type="text"
                    placeholder='username'
                    style='p-3 mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-blue text-primary'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <CustomInput
                    type="email"
                    placeholder='email'
                    style='p-3 mt-4 rounded-md border-2 border-grey focus:outline-none focus:border-blue text-primary'
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
                    text="Create Account"
                />
            </form>
        </div>
    )
}

export { SignUp };
