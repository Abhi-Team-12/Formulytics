import { useState } from 'react';

export default function AuthForm({ isLogin, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white p-6 rounded-xl shadow-md space-y-4
        w-full max-w-md
        mx-auto
        sm:max-w-sm sm:p-4
        xs:max-w-full xs:px-4 xs:py-6
      "
    >
      <h2 className="text-xl font-bold text-center">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input"
          onChange={handleChange}
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input"
        onChange={handleChange}
      />
      <button className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700 transition">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
