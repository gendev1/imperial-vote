/* eslint-disable @next/next/no-img-element */

export default function HeroThumbSection() {
	return (
		<div className="section bg-warning-200">
			<div className="container">
				{/*<div className="fugu-single-thumb wow fadeInUpX" data-wow-delay="0.20s">*/}
				{/*	<img src="/images/all-img/v2/hero-thumb.png" alt="" />*/}
				{/*</div>*/}
				<div className="fugu-hero-content fugu-hero-content2">
					<h1 className="wow fadeInUpX projectname" data-wow-delay="0s">
						About Us
					</h1>
					<br/>
					<br/>
					<p className="fadeInUpX welcome" data-wow-delay="0s">
						We have many voting and governance analysis tool that allows members of a protocol DAO (e.g. Compound, Uniswap, or Gitcoin, etc.) to vote on active on-chain proposals, delegate votes to a third party, or view previous proposals. But it comes with a great cost
						We provide a solution called “Imperial Vote” to perform voting in a way that saves money. We decouple voting from DAO and governance from proposal and couple it in a cost effective chain platform.
					</p>
					<br/>
					<br/>
				</div>
			</div>
		</div>


	);
}
