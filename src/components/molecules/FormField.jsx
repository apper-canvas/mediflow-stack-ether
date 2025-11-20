import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className,
  children,
  required = false,
  ...props 
}) => {
  const renderInput = () => {
    if (children) return children;
    
    if (type === "select") {
      return <Select {...props} />;
    }
    
    if (type === "textarea") {
      return (
        <textarea
          className={cn(
            "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
            error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""
          )}
          rows={4}
          {...props}
        />
      );
    }
    
    return (
      <Input 
        type={type} 
        className={error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
        {...props} 
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;