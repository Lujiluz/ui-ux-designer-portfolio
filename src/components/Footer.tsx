const Footer = () => {
  return (
    <footer id="letstalk" className="border-t border-border py-8 px-6 md:px-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-body">
          © 2024 Rima Zakiyatin Arifah. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Email", "LinkedIn", "Dribbble"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
