import React from "react";
import styles from "./LegalPages.module.scss";


const TermsOfServicePage: React.FC = () => {
return (
<div className={styles.container}>
<h1>Terms of Service</h1>
<p className={styles.updated}>Last updated: December 14, 2025</p>


<section>
<p>
By accessing or using <strong>Calcalil</strong>, you agree to these Terms of
Service.
</p>
</section>


<section>
<h2>Use of the Website</h2>
<p>
You agree to use this website for lawful purposes only and not to misuse or
disrupt the service.
</p>
</section>


<section>
<h2>Financial Disclaimer</h2>
<p>
All calculations and financial information provided are for informational
purposes only and do not constitute financial, legal, or tax advice.
</p>
</section>


<section>
<h2>No Guarantees</h2>
<p>
The website is provided "as is" without warranties of any kind regarding
accuracy, availability, or suitability.
</p>
</section>


<section>
<h2>Limitation of Liability</h2>
<p>
We are not liable for financial losses, data loss, or damages arising from the
use of this website.
</p>
</section>


<section>
<h2>Intellectual Property</h2>
<p>
All content, design, and code are the property of Calcalil unless otherwise
stated.
</p>
</section>


<section>
<h2>Contact</h2>
<p>Email: your-email@example.com</p>
</section>
</div>
);
};


export default TermsOfServicePage;