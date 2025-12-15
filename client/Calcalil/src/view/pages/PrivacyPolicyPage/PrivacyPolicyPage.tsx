import React from "react";
import styles from "./LegalPages.module.scss";
import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";



const PrivacyPolicyPage: React.FC = () => {
return (
<div className={styles.container}>
    <BackToWelcomeButton />
<h1>Privacy Policy</h1>
<p className={styles.updated}>Last updated: December 14, 2025</p>


<section>
<p>
Welcome to <strong>Calcalil</strong> ("we", "our", or "us"). Your privacy is
important to us. This Privacy Policy explains how we collect, use, and protect
your information when you use our website.
</p>
</section>


<section>
<h2>Information We Collect</h2>
<h3>Personal Information</h3>
<p>
We do not require you to create an account or provide personal information to
use the core features of this website.
</p>


<h3>Usage Data</h3>
<p>
We may collect non-personal information such as browser type, device type,
pages visited, and time spent on the site to improve user experience.
</p>


<h3>Cookies</h3>
<p>
We may use cookies to improve functionality, analyze traffic, and display
advertisements. You can disable cookies in your browser settings.
</p>
</section>


<section>
<h2>Advertising</h2>
<p>
Third-party advertising partners may use cookies or similar technologies. We do
not control these cookies and recommend reviewing their privacy policies.
</p>
</section>


<section>
<h2>Data Storage</h2>
<p>
Financial data entered into this site is stored locally in your browser (if
applicable). We do not store financial or personal data on our servers.
</p>
</section>


<section>
<h2>Children’s Privacy</h2>
<p>
This website is not intended for children under the age of 13. We do not
knowingly collect personal information from children.
</p>
</section>


<section>
<h2>Contact</h2>
<p>Email: your-email@example.com</p>
</section>
</div>
);
};


export default PrivacyPolicyPage;