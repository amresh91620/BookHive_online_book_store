const ProfileSettings = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-8 py-10 text-white">
          <h1 className="text-2xl font-semibold font-serif">Settings</h1>
          <p className="text-white/70 text-sm mt-1">Manage preferences</p>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Email Notifications</div>
              <div className="text-xs text-slate-500">Receive updates about new books</div>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-blue-700" defaultChecked />
          </div>
          <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Public Profile</div>
              <div className="text-xs text-slate-500">Allow others to see your reviews</div>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-blue-700" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
