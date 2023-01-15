//Import components
import Head from "next/head";
import { Container, Text } from "@nextui-org/react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../../../components/layouts/RootLayout";
import initPocketBase from "../../../../helpers/initPocketbase";
import { getCookie } from "cookies-next";

// Import types
import type { ReactElement } from "react";
import type { GetServerSidePropsContext } from "next";

// Fire the Home page
export default function MeEdit() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("sitename") + " | Edit my profile"}</title>
        <meta name="description" content={t("meta_description")} />
      </Head>
      <Container fluid>
        <Text h2>Edit my profile</Text>
      </Container>
      <Container fluid>Content</Container>
    </>
  );
}

// Export serverside props
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get the language cookie
  const langCookie = getCookie("NEXT_LOCALE", context.res);

  // Init PocketBase
  const pb = await initPocketBase(context);

  // Strip the authData from the pb authStore
  const authData = JSON.parse(JSON.stringify(pb.authStore));

  // If the language cookie is not the actual language, redirect to correct language
  if (langCookie && langCookie !== context.locale) {
    return {
      redirect: {
        destination: "/" + langCookie + context.resolvedUrl,
        permanent: false,
      },
    };
  }

  // Return the props if the correct language is set
  return {
    props: {
      isLoggedIn: pb.authStore.isValid,
      authData: authData.baseModel,
    },
  };
}

MeEdit.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
