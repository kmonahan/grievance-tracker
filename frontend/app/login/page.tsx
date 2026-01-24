export default function Login() {
  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="text-5xl font-montserrat font-weight-bold leading-10 tracking-tight text-neutral-0 dark:text-zinc-50">
          Log In
        </h1>
        <form className="w-full sm:w-sm max-w-sm sm:max-w-none flex flex-col items-center gap-6 text-center sm:items-start">
          <div className="flex flex-col items-start gap-3 w-full">
            <label htmlFor="email" className="text-xl text-neutral-0">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required={true}
              className="bg-neutral-0 text-neutral-900 px-4 py-2 w-full"
            />
          </div>
          <div className="flex flex-col items-start gap-3 w-full">
            <label htmlFor="password" className="text-xl text-neutral-0">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required={true}
              className="bg-neutral-0 text-neutral-900 px-4 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-600 text-neutral-0 font-bold font-montserrat text-2xl py-4 px-8 cursor-pointer hover:bg-orange-800"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
