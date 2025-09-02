
import image from '../../../../assets/HomeImages/faq.png'
import TitleAndSubheading from '../../../../Components/SharedComponets/TitleAndSubheading';

const Faq = () => {
	return (
		<div>
			<TitleAndSubheading title="Frequently Asked Questions "></TitleAndSubheading>
			<div className=" flex flex-col lg:items-center lg:justify-center lg:gap-10 lg:flex-row">
				<img
					src={image}
					className="rounded-lg " />
				<div>
					<section className="bg-[#179ac8] text-white">
						<div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8">
	
							<p className="mt-4 mb-8 text-white">Seamlessly Manage Your Events with Our Comprehensive System. Whether you're booking, organizing, or tracking event performance, our platform simplifies the entire process, ensuring a smooth and efficient experience for all users.</p>
							<div className="space-y-4">
								<details className="w-full border rounded-lg">
									<summary className="px-4 py-6 focus:outline-none focus-visible:ring-default-600">How does the booking process work for events?</summary>
									<p className="px-4 py-6 pt-0 ml-4 -mt-4 text-white">The event management system allows users to browse available events, view event details, and make bookings online. Users can select their desired event, provide necessary details, and complete the booking through an integrated payment gateway. Confirmation is sent via email or through the user dashboard.</p>
								</details>
								<details className="w-full border rounded-lg">
									<summary className="px-4 py-6 focus:outline-none focus-visible:ring-default-600">Can I manage multiple events at the same time?</summary>
									<p className="px-4 py-6 pt-0 ml-4 -mt-4 text-white">Yes, the event management system allows administrators and moderators to manage multiple events simultaneously. They can track ongoing events, assign tasks, update event details, and manage participants, ensuring smooth coordination for all events.</p>
								</details>
								<details className="w-full border rounded-lg">
									<summary className="px-4 py-6 focus:outline-none focus-visible:ring-default-600">How can I track event performance and generate reports?</summary>
									<p className="px-4 py-6 pt-0 ml-4 -mt-4 text-white">The admin dashboard includes tools to monitor event progress and generate reports. You can track key metrics such as event attendance, revenue, and participant feedback. The system also provides detailed reports on completed events and overall performance for future planning.</p>
								</details>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Faq;