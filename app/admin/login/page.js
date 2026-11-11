import { login } from '../actions';

export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } };

export default function Login({ searchParams }) {
  const msg = { bad: 'Email or password is incorrect.', denied: 'This account is not authorised for the admin area.' }[searchParams.e];
  return (
    <div className="adm" style={{ display: 'grid', placeItems: 'center', padding: 20 }}>
      <form action={login} className="panel form" style={{ width: '100%', maxWidth: 400 }}>
        <h1>Admin sign in</h1>
        {msg && <div className="bad" role="alert">{msg}</div>}
        <label>Email<input name="email" type="email" required autoComplete="username" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        <button className="btn" type="submit">Sign in</button>
      </form>
    </div>
  );
}
