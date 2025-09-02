import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  console.log(payments);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosSecure.get(
          `/bookings/payments/user/${user?.email}`
        );
        // Handle both array and single object responses
        const paymentsData = response.data?.data || response.data;
        setPayments(
          Array.isArray(paymentsData)
            ? paymentsData
            : paymentsData
            ? [paymentsData]
            : []
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
        setError(err.message);
      }
    };

    if (user?.email) fetchPayments();
  }, [user?.email, axiosSecure]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in paisa
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#179ac8" }}
          ></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <p className="text-lg font-medium mb-2">Error Loading Payments</p>
            <p className="text-sm">{error}</p>
            <button
              //   onClick={fetchPayments}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your payment transactions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            className="px-6 py-4 border-b border-gray-200"
            style={{ backgroundColor: "#179ac8" }}
          >
            <h2 className="text-xl font-semibold text-white">
              Recent Transactions
            </h2>
          </div>

          {!payments || payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.transactionId}
                          </div>
                          <div className="text-sm text-gray-500">
                            Booking: {payment.bookingId}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {payment._id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div
                            className="text-lg font-semibold"
                            style={{ color: "#179ac8" }}
                          >
                            {formatAmount(payment.amount)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {payment.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {payment.paymentDetails?.card_type || "N/A"}
                          </div>
                          <div className="text-gray-600">
                            {payment.paymentDetails?.card_issuer || "N/A"}
                          </div>
                          <div className="text-gray-500">
                            {payment.paymentDetails?.card_issuer_country ||
                              "N/A"}
                          </div>
                          {payment.paymentDetails?.val_id && (
                            <div className="text-xs text-gray-400 mt-1">
                              Val ID: {payment.paymentDetails.val_id}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(payment.status)}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.createdAt)}
                        </div>
                        {payment.paymentDetails?.tran_date && (
                          <div className="text-xs text-gray-500">
                            Processed: {payment.paymentDetails.tran_date}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {payments.length} transaction
          {payments.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};

export default PaymentsTable;
