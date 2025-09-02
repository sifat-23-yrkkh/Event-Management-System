// import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TitleAndSubheading from '../../Shared/TitleAndSubheading';
import Swal from 'sweetalert2';
import { RiDeleteBin6Fill } from "react-icons/ri";
import Button_Customize from '../../Shared/Button_Customize';

const AdminManageUsers = () => {
    const axiosSecure = useAxiosSecure()
    const { refetch, data: users = [] } = useQuery({
        queryKey: ['requestToAdmin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users')
            console.log(res.data)
            return res.data;
        }
    });

    const handleModerator = (user) => {
        axiosSecure.patch(`/users/moderator/${user._id}`)
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.name} is Moderator now`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refetch()
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.name} is already Moderator `,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    const handleDelete = _id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/user/${_id}`)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                        refetch()
                    })
            }
        });
    }

    return (
        <div className=' mx-auto'>
            <TitleAndSubheading title="Manage Users " ></TitleAndSubheading>
            <div className='w-full'>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th className='text-center'>Role</th>
                                {/* <th>Action</th> */}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <th>{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    {/* <td>{user.role}</td> */}
                                    <td className='text-center'>
                                        {user.role === 'user' ? (
                                            <Button_Customize
                                                name="Make Moderator"
                                                onClick={() => handleModerator(user)}
                                                className="btn text-black m-2"
                                            >

                                            </Button_Customize>
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="btn text-red-400 mx-auto"
                                        >
                                            <RiDeleteBin6Fill />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminManageUsers;