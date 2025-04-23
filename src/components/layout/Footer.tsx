export default function Footer() {

  const date = new Date();

  return (
    <footer className="flex items-center justify-center p-5 mb-5 xl:flex border-t-2 border-y-2">
      ® {date.getFullYear()} AQUAFLEX INDUSTRIES
    </footer>
  )
}


