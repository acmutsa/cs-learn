import Link from "next/link";

export default function Navigation(){
    <nav className="bg-blue-500">
        <ul>
            <li>
                <Link href = "/">ACM learn</Link>
            </li>
            <li>
                <Link href = "/categories">Categories</Link>
            </li>
            <li>
                <div>
                    <Link className = "rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold transition hover:border-blue-500 hover:text-blue-600" href ="/login">Login</Link>
                    <Link className = "rounded-md brder" href ="/profile"> profile pic</Link>    
                </div>
            </li>
        </ul>
    </nav>
}
