"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LegalPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Legal Information</h1>

      <Tabs defaultValue="terms">
        <TabsList className="mb-8">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
              <CardDescription>Last updated: April 1, 2023</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to HomeHub. These Terms of Service govern your use of our website and services. By accessing or
                using HomeHub, you agree to be bound by these Terms.
              </p>

              <h2>2. Definitions</h2>
              <p>
                <strong>"HomeHub"</strong> refers to our company, website, and services.
                <br />
                <strong>"User"</strong> refers to anyone who accesses or uses HomeHub.
                <br />
                <strong>"Property Owner"</strong> refers to users who list properties on HomeHub.
                <br />
                <strong>"Renter"</strong> refers to users who browse and inquire about properties on HomeHub.
              </p>

              <h2>3. Account Registration</h2>
              <p>
                To access certain features of HomeHub, you must register for an account. You agree to provide accurate,
                current, and complete information during the registration process and to update such information to keep
                it accurate, current, and complete.
              </p>

              <h2>4. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use HomeHub for any illegal purpose or in violation of any local, state, national, or international
                  law
                </li>
                <li>Harass, abuse, or harm another person</li>
                <li>Impersonate another user or person</li>
                <li>Post false or misleading information</li>
                <li>Attempt to gain unauthorized access to HomeHub's systems or user accounts</li>
                <li>Use HomeHub in a manner that could disable, overburden, damage, or impair the site</li>
              </ul>

              <h2>5. Property Listings</h2>
              <p>
                Property Owners are responsible for the accuracy of their listings. HomeHub reserves the right to remove
                any listing that violates these Terms or is deemed inappropriate.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                HomeHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                including loss of profits, data, or other intangible losses.
              </p>

              <h2>7. Changes to Terms</h2>
              <p>
                HomeHub reserves the right to modify these Terms at any time. We will provide notice of significant
                changes by posting the updated Terms on our website.
              </p>

              <h2>8. Termination</h2>
              <p>
                HomeHub may terminate or suspend your account and access to our services at any time, without prior
                notice or liability, for any reason.
              </p>

              <h2>9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, without
                regard to its conflict of law provisions.
              </p>

              <h2>10. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at legal@homehub.com.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Last updated: April 1, 2023</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                This Privacy Policy explains how HomeHub collects, uses, and discloses information about you when you
                use our website and services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as:</p>
              <ul>
                <li>Account information (name, email, password)</li>
                <li>Profile information (phone number, address)</li>
                <li>Property listings (descriptions, images, location)</li>
                <li>Messages between users</li>
                <li>Feedback and support requests</li>
              </ul>

              <p>We also automatically collect certain information when you use HomeHub, such as:</p>
              <ul>
                <li>Log information (IP address, browser type, pages visited)</li>
                <li>Device information (hardware model, operating system)</li>
                <li>Location information</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve HomeHub</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              </ul>

              <h2>4. Sharing of Information</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>Other users (e.g., when you send messages or share property information)</li>
                <li>Service providers (e.g., hosting, analytics, email delivery)</li>
                <li>Legal authorities when required by law</li>
                <li>In connection with a business transfer (e.g., merger, acquisition)</li>
              </ul>

              <h2>5. Your Choices</h2>
              <p>
                You can access and update certain information about you from your account settings. You can also opt out
                of receiving promotional emails by following the instructions in those emails.
              </p>

              <h2>6. Data Security</h2>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and
                unauthorized access.
              </p>

              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising
                the date at the top of the policy.
              </p>

              <h2>8. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@homehub.com.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cookies">
          <Card>
            <CardHeader>
              <CardTitle>Cookie Policy</CardTitle>
              <CardDescription>Last updated: April 1, 2023</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used to make websites work more efficiently and provide information to the website
                owners.
              </p>

              <h2>2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li>
                  <strong>Essential cookies:</strong> These are necessary for the website to function properly.
                </li>
                <li>
                  <strong>Functionality cookies:</strong> These remember your preferences and settings.
                </li>
                <li>
                  <strong>Performance cookies:</strong> These help us understand how visitors interact with our website.
                </li>
                <li>
                  <strong>Targeting cookies:</strong> These are used to deliver relevant advertisements.
                </li>
              </ul>

              <h2>3. Types of Cookies We Use</h2>
              <p>
                <strong>Session Cookies:</strong> These are temporary cookies that are deleted when you close your
                browser.
                <br />
                <strong>Persistent Cookies:</strong> These remain on your device until they expire or you delete them.
              </p>

              <h2>4. Third-Party Cookies</h2>
              <p>
                We also use cookies from third parties for analytics and advertising purposes. These third parties may
                combine the information they collect on our website with other information they have collected
                elsewhere.
              </p>

              <h2>5. Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. You can usually find these
                settings in the "Options" or "Preferences" menu of your browser. You can also delete cookies that have
                already been set.
              </p>

              <h2>6. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new
                Cookie Policy on this page.
              </p>

              <h2>7. Contact Us</h2>
              <p>If you have any questions about our Cookie Policy, please contact us at privacy@homehub.com.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
