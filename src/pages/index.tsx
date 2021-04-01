import Head from 'next/head';
import { GetStaticProps } from 'next';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from '../styles/home.module.scss';

interface HomeProps {
  product: {
    priceId : string;
    amount: number;
    amountFormat: string;
  }
}
export default function Home({product}:HomeProps) {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>
    <main className={styles.contentContainer}>  
      <section className={styles.hero} >
        <span>👏 Hey, Welcome</span>
        <h1>News about the <span>React</span> world</h1>
        <p>
          Get acess to all the publications
          <span>for {product.amountFormat} month</span>
        </p>
        <SubscribeButton  priceId={product.priceId} />
      </section>

      <img src="/images/avatar.svg" alt="Girl coding" />
    </main>  
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID, {
    expand: ['product']
  });
  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100,
    amountFormat: new Intl.NumberFormat('en-US',{
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}
