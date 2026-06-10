import { useNavigate } from "react-router-dom";
import { Button, type ButtonVariant, type ButtonSize } from "@shared/ui";
import { Icon } from "@shared/icons";
import { routes } from "@shared/config/routes";

interface CreateCompanyButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

export function CreateCompanyButton({
  variant = "primary",
  size = "md",
  full = false,
}: CreateCompanyButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("[CreateCompanyButton] navigating to", routes.recruiterCompanyRegistration);
    navigate(routes.recruiterCompanyRegistration);
  };

  return (
    <Button
      variant={variant}
      size={size}
      full={full}
      type="button"
      iconLeft={<Icon name="Plus" size={16} />}
      onClick={handleClick}
    >
      Create Company
    </Button>
  );
}
