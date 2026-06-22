import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
};

const Profile = () => {
  const { backendUrl, token, navigate, logout } = useContext(ShopContext);
  const [formData, setFormData] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isAuthFailure = (message = "") => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes("login again") ||
      lowerMessage.includes("not authorized") ||
      lowerMessage.includes("jwt")
    );
  };

  const loadProfile = async () => {
    if (!token) {
      navigate("/login", { state: { from: "/profile" } });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/profile`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setFormData({ ...initialProfile, ...response.data.profile });
      } else if (isAuthFailure(response.data.message)) {
        logout();
        return;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        setFormData({ ...initialProfile, ...response.data.profile });
        toast.success(response.data.message);
      } else if (isAuthFailure(response.data.message)) {
        logout();
        return;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  return (
    <div className="page-divider border-t pb-16 pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="PROFILE" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="surface-panel bg-gradient-to-b from-[#2f281f] to-[#4e563d] p-6 text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d6b46a] text-2xl font-semibold text-[#17130f]">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="mt-4 text-xl font-medium text-white">
            {formData.name || "Your Profile"}
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Keep your account details updated so future orders are easier to place.
          </p>

          <div className="mt-6 space-y-4 text-sm text-white/70">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6b46a]">Email</p>
              <p className="mt-1 break-all text-white/80">{formData.email || "Not added yet"}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6b46a]">Phone</p>
              <p className="mt-1 text-white/80">{formData.phone || "Not added yet"}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6b46a]">Gender</p>
              <p className="mt-1 text-white/80">{formData.gender || "Not selected yet"}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d6b46a]">Age</p>
              <p className="mt-1 text-white/80">{formData.age || "Not added yet"}</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className="surface-panel p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-gray-700">Full Name</p>
              <input
                required
                name="name"
                value={formData.name}
                onChange={onChangeHandler}
                className="w-full rounded border border-gray-300 px-3.5 py-2"
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-gray-700">Email Address</p>
              <input
                required
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                className="w-full rounded border border-gray-300 px-3.5 py-2"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Phone Number</p>
              <input
                name="phone"
                value={formData.phone}
                onChange={onChangeHandler}
                className="w-full rounded border border-gray-300 px-3.5 py-2"
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Age</p>
              <input
                name="age"
                value={formData.age}
                onChange={onChangeHandler}
                className="w-full rounded border border-gray-300 px-3.5 py-2"
                type="number"
                min="1"
                max="120"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Gender</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={onChangeHandler}
                className="w-full rounded border border-gray-300 px-3.5 py-2"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {isLoading ? "Loading your saved details..." : "You can edit these details at any time."}
            </p>
            <button
              disabled={isLoading || isSaving}
              type="submit"
              className="primary-action px-8 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
