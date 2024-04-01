interface IUserList {
    users: Array<{
        id: string;
        username: string;
    }>;
}

const UserList = ({ users }: IUserList) => {

    return (
        <div className='bg-primary-mid-dark h-screen p-4 text-center'>
            <div className='text-md font-bold bg-primary rounded-md p-2'>
                List of Users
            </div>
            <div className='scroll-auto mx-4 mt-4 divide-y divide-dashed'>
                {users?.map((user) => (
                    <div className='p-3' key={user.id}>
                        {user.username}
                    </div>
                ))}
            </div>
        </div>
    )
}

export { UserList }
