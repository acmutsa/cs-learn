"use client";
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client'; // Adjust path to your auth client instance

interface AutoSignInProps {
  account_id?: string;
  password?: string;
  callbackUrl?: string;
}

/**
 * A component for testing that automatically attempts to sign in on mount.
 */
const AutoSignInTestComponent = ({ 
  account_id = "test", // Default test user
  password = "test",    // Default test password
  callbackUrl = "/dashboard"       // Redirect location on success
}: AutoSignInProps) => {

  useEffect(() => {
    const signIn = async () => {
      console.log(`Attempting to sign in test user: ${account_id}`);
      
      const { error } = await authClient.signIn({
        account_id,
        password,
        callbackU: callbackUrl,
      });

      if (error) {
        console.error("Auto sign-in failed:", error.message);

      } else {
        console.log("Auto sign-in successful!");
      }
    };

    signIn();
  }, [account_id, password, callbackUrl]); // Re-run if props change (though unlikely in this context)

  return (
    <div>
      {/* Visual indicator for your tests */}
      <p>Running auto sign-in logic...</p>
    </div>
  );
};

export default AutoSignInTestComponent;