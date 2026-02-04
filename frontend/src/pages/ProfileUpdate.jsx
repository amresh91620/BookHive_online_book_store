const ProfileUpdate = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-8 py-10 text-white">
          <h1 className="text-2xl font-semibold font-serif">Update Profile</h1>
          <p className="text-white/70 text-sm mt-1">Edit your profile details</p>
        </div>
        <div className="p-8">
          <div className="grid gap-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-700" placeholder="Full Name" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-700" placeholder="Email Address" />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-700" placeholder="New Password" type="password" />
            <button className="bg-blue-700 hover:bg-blue-800 text-white rounded-2xl py-3 font-semibold uppercase tracking-wider">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
