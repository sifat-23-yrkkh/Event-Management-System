import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AdminEventsTable from "./AdminEventsTable";
import toast from "react-hot-toast";

const AdminEventsPage = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosSecure.get("/events/events");
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [axiosSecure]);

  const handlePublish = async (eventId) => {
    try {
      const response = await axiosSecure.patch(`/events/${eventId}/publish`);
      setEvents(events.map(event => 
        event._id === eventId ? response.data : event
      ));
    } catch (error) {
      console.error("Error publishing event:", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axiosSecure.delete(`/events/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading events...
      </div>
    );
  }

  return (
    <AdminEventsTable 
      events={events} 
      onPublish={handlePublish}
      onDelete={handleDelete}
    />
  );
};

export default AdminEventsPage;