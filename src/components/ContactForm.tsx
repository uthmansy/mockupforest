"use client";
import { useForm, ValidationError } from "@formspree/react";

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mblqrzpg");

  if (state.succeeded) {
    return (
      <div className=" bg-green-100 p-6 py-20 text-center">
        <p
          className="text-green-700 font-medium text-lg uppercase"
          style={{ marginBottom: 0 }}
        >
          Thanks for Getting in touch!
        </p>

        <p style={{ marginBottom: 0 }} className="text-green-600">
          We'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Your Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
          placeholder="your.email@example.com"
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="text-red-500 text-xs mt-1"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
          placeholder="What would you like to say?"
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="text-red-500 text-xs mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-primary hover:bg-primary/70 disabled:bg-white/30 text-white font-medium uppercase cursor-pointer py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {state.submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
