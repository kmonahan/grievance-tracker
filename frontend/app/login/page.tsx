export default function Login() {
  return (
    <main className="flex w-full max-w-5xl mx-auto px-5 md:px-10 flex-col gap-12 items-start">
      <h1 className="text-5xl font-mono font-weight-bold text-primary leading-10 tracking-tight">
        Log In
      </h1>
      <form className="bg-teal-500 p-12 w-full flex flex-col items-center gap-6 text-center sm:items-start rounded-xl">
        <div className="flex flex-col items-start gap-3 w-full max-w-sm">
          <label htmlFor="email" className="text-xl text-primary-foreground">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required={true}
            className="bg-teal-0 text-neutral-900 px-4 py-2 w-full rounded-sm"
          />
        </div>
        <div className="flex flex-col items-start gap-3 w-full max-w-sm">
          <label htmlFor="password" className="text-xl text-teal-0">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required={true}
            className="bg-teal-0 text-teal-900 px-4 py-2 w-full rounded-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-accent text-accent-foreground font-bold font-mono text-2xl py-4 px-8 cursor-pointer transition-colors hover:bg-background hover:text-accent rounded-md"
        >
          Log In
        </button>
      </form>
    </main>
  );
}
