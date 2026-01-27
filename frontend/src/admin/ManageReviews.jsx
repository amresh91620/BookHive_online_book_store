const ManageReviews = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>

      <div className="bg-white p-4 rounded shadow">
        <p><b>User:</b> Rahul</p>
        <p><b>Review:</b> Amazing book!</p>
        <button className="text-red-500 mt-2">Delete</button>
      </div>
    </div>
  );
};

export default ManageReviews;
