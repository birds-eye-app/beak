import { NavLink } from "react-router";

export function Home() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/birds_eye">Birds Eye</NavLink>
        </li>
        <li>
          <NavLink to="/chirped">Chirped</NavLink>
        </li>
      </ul>
    </nav>
  );
}
