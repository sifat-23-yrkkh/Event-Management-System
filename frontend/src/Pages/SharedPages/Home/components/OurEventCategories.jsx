import concert from '../../../../assets/HomeImages/concerts.png';
import birthday from '../../../../assets/HomeImages/birthday.png'
import conference from '../../../../assets/HomeImages/conference.png';
import wedding from '../../../../assets/HomeImages/wedding.png'
import festival from '../../../../assets/HomeImages/festivals.png'
import newYear from '../../../../assets//HomeImages/new-year.png'
import TitleAndSubheading from '../../../../Components/SharedComponets/TitleAndSubheading';

const OurEventCategories = () => {
    return (
        <div className='container mx-auto mt-32 md:mt-0 lg:mt-0'>
            <TitleAndSubheading title="Our Top Categories"></TitleAndSubheading>
            <div  className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div>
                <div className=" rounded-md shadow-md">
                    <img src={concert} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500" />
                    <div className="bg-[#179ac8] p-2 rounded-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-white text-center  tracking-wide">Concert</h2>
                            </div>
                    </div>
                </div>
            </div>
            <div>
                <div className=" rounded-md shadow-md">
                    <img src={birthday} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500" />
                    <div className="bg-[#179ac8] p-2 rounded-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-white text-center  tracking-wide">Birthday</h2>
                            </div>
                    </div>
                </div>
            </div>
            <div>
                <div className=" rounded-md shadow-md">
                    <img src={festival} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500" />
                    <div className="bg-[#179ac8] p-2 rounded-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-white text-center  tracking-wide">Festival</h2>
                            </div>
                    </div>
                </div>
            </div>
            <div>
                <div className=" rounded-md shadow-md">
                    <img src={wedding} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500" />
                    <div className="bg-[#179ac8] p-2 rounded-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-white text-center  tracking-wide">Wedding</h2>
                            </div>
                    </div>
                </div>
            </div>
            <div>
                <div className=" rounded-md shadow-md">
                    <img src={newYear} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500" />
                    <div className="bg-[#179ac8] p-2 rounded-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-white text-center  tracking-wide">New Year Party</h2>
                            </div>
                    </div>
                </div>
            </div>
            <div>
                <div className=" rounded-md shadow-md">
                    <img src={conference} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500" />
                    <div className="bg-[#179ac8] p-2 rounded-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-white text-center  tracking-wide">Conference</h2>
                            </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default OurEventCategories;