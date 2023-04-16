/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function FeatureSection() {
	return (
		<div className="section bg-warning-200 fugu-section-padding3">
			<div className="container">
				<div className="fugu-section-title">
					<h2>Advantages of Imperial Vote</h2>
				</div>
				<div className="row">
					<div className="col-lg-4 col-md-6">
						<div className="fugu-iconbox-wrap2 wow fadeInUpX" data-wow-delay="0s">
							<div className="fugu-iconbox-icon2 ">
								<img className="iv-advantage-icon" src="/images/all-img/v2/myicon1.png" alt="" />
							</div>
							<div className="fugu-iconbox-data2">
								<h4>Cost Effective</h4>
								<p>
									The high cost of DAO application can be reduced.
								</p>
							</div>
						</div>
					</div>
					<div className="col-lg-4 col-md-6">
						<div className="fugu-iconbox-wrap2 wow fadeInUpX" data-wow-delay="0.20s">
							<div className="fugu-iconbox-icon2">
								<img className="iv-advantage-icon" src="/images/all-img/v2/myicon2.png" alt="" />
							</div>
							<div className="fugu-iconbox-data2">
								<h4>Multi Chain Links</h4>
								<p>
									Allows users to transact across multiple chains at the same time.
								</p>
							</div>
						</div>
					</div>
					<div className="col-lg-4 col-md-6 offset-lg-0 offset-md-3">
						<div className="fugu-iconbox-wrap2 wow fadeInUpX" data-wow-delay="0.30s">
							<div className="fugu-iconbox-icon2">
								<img className="iv-advantage-icon" src="/images/all-img/v2/myicon3.png" alt="" />
							</div>
							<div className="fugu-iconbox-data2">
								<h4>Unified Experience</h4>
								<p>
									It provides improved customer engagement and experience.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
