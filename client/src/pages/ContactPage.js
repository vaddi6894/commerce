import { useState } from "react";
import api from "../api/api";
import Message from "../components/Message";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    api
      .post("/contact", form)
      .then(() => setSuccess("Message sent!"))
      .catch(() => setError("Failed to send message."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-minimal p-8">
        <h2 className="text-2xl font-bold mb-6 font-sans">Contact Us</h2>
        {success && <Message type="success">{success}</Message>}
        {error && <Message type="error">{error}</Message>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-500 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
              rows={4}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded-full px-6 py-2 font-semibold shadow-minimal hover:scale-105 transition-transform disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
