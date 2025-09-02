import React from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';
import TitleAndSubheading from '../../Shared/TitleAndSubheading';

const EditEvent = () => {
    const data = useLoaderData()
    console.log(data);
    const {register} = useForm()

    return (
        <div className="container mx-auto">
            <TitleAndSubheading title="Edit Event Details"></TitleAndSubheading>
                <div className="flex flex-wrap  -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-black text-lg font-bold mb-2" >
                            Package Name :
                        </label>
                        <input defaultValue={data?.package_name} required  {...register('package')} className="appearance-none block w-full bg-white text-black border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Package Name" />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-black text-lg font-bold mb-2" >
                            Price
                        </label>
                        <input defaultValue={data?.price} required {...register('price')} className="appearance-none block w-full bg-white text-black  border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" placeholder="Price" />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-black text-lg font-bold mb-2" >
                            Photography Team
                        </label>
                        <input defaultValue={data?.photography_team_size} required {...register('photography-team')} className="appearance-none block w-full bg-white text-black  border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="number" placeholder="Photography Team" />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-black text-lg font-bold mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <select defaultValue={data?.category} required {...register('category')} className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                <option value='' >Select Category</option>
                                <option>Birthday</option>
                                <option>Conference</option>
                                <option>Concert</option>
                                <option>Wedding</option>
                                <option>New Year Party</option>
                                <option>Festival</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-black text-lg font-bold mb-2">
                            Videography
                        </label>
                        <div className="relative">
                            <select defaultValue={data?.videography} required {...register('videography')} className="block appearance-none w-full  border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                <option value=''>Select Videography</option>
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mb-5">
                    <label className="block uppercase tracking-wide text-black text-lg font-bold mb-2" >
                        Features
                    </label>
                    <textarea defaultValue={data?.features} required {...register('features')} rows={5} className="appearance-none block w-full bg-white text-black  border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="Write Features">
                    </textarea>
                </div>
        </div>
    );
};

export default EditEvent;