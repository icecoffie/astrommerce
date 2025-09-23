    import { FC } from "react";
    import { Link } from "react-router-dom";
    import { Home, ChevronRight  } from "lucide-react"; 

    interface BreadcrumbItem {
    name: string;
    to?: string;
    }

    interface BreadcrumbProps {
    items: BreadcrumbItem[];
    }

    const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
    return (
    <nav className="text-sm text-gray-600 flex items-center space-x-2 py-3 px-10 ">
      <Link to="/" className="flex items-center text-subtleText gap-2 hover:text-pr">
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.to ? (
            <Link
              to={item.to}
              className="text-blue-600 hover:underline transition-colors duration-200"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-gray-500">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
    );
    };

    export default Breadcrumb;
