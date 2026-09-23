import { useLocation, useNavigate } from 'react-router'

/** Test-only readout of the current path, plus a button that acts like browser Back. */
export function LocationProbe() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Current path">{location.pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>
        Browser back
      </button>
    </>
  )
}
