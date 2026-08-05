import { useNavigate } from 'react-router-dom';

export function useAppNavigation() {
  const navigate = useNavigate();

  return (page, id) => {
    switch (page) {
      case 'home': navigate('/'); break;
      case 'property': navigate(`/property/${id}`); break;
      default: navigate(`/${page}`); break;
    }
  };
}
