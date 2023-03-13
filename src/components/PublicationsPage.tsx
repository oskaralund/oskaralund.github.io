import React from "react"
import Header from "./Header"


const HomePage = (): JSX.Element => (
  <div>
    <Header />
    <div className="section">
      <a
        href="https://www.sciencedirect.com/science/article/pii/S0021999120305957"
      >
        <h2 className="publication-title">
          Neural network enhanced computations on coarse grids
        </h2>
      </a>
      <p>
      Unresolved gradients produce numerical oscillations and inaccurate results. The most straightforward solution to such a problem is to increase the resolution of the computational grid. However, this is often prohibitively expensive and may lead to ecessive execution times. By training a neural network to predict the shape of the solution, we show that it is possible to reduce numerical oscillations and increase both accuracy and efficiency. Data from the neural network prediction is imposed using multiple penalty terms inside the domain.
      </p>
    </div>


    <div className="section">
      <a
        href="https://www.sciencedirect.com/science/article/pii/S0021999119301184"
      >
        <h2 className="publication-title">
          Encapsulated high order difference operators on curvilinear non-conforming grids
        </h2>
      </a>
      <p>
        Constructing stable difference schemes on complex geometries is an arduous task. Even fairly simple partial differential equations end up very convoluted in their discretized form, making them difficult to implement and manage. Spatial discretizations using so called summation-by-parts operators have mitigated this issue to some extent, particularly on rectangular domains, making it possible to formulate stable discretizations in a compact and understandable manner. However, the simplicity of these formulations is lost for curvilinear grids, where the standard procedure is to transform the grid to a rectangular one, and change the structure of the original equation.
      </p>
      <p>
        In this paper we reinterpret the grid transformation as a transformation of the summation-by-parts operators. This results in operators acting directly on the curvilinear grid. Together with previous developments in the field of nonconforming grid couplings we can formulate simple, implementable, and provably stable schemes on general nonconforming curvilinear grids. The theory is applicable to methods on summation-by-parts form, including finite differences, discontinuous Galerkin spectral element, finite volume, and flux reconstruction methods. Time dependent advection–diffusion simulations corroborate the theoretical development.
      </p>
    </div>


    <div className="section">
      <a
        href="https://www.sciencedirect.com/science/article/pii/S0021999120306914"
      >
        <h2 className="publication-title">
          Trace preserving quantum dynamics using a novel reparametrization-neutral summation-by-parts difference operator
        </h2>
      </a>
      <p>
        We develop a novel numerical scheme for the simulation of dissipative quantum dynamics, following from two-body Lindblad master equations. It exactly preserves the trace of the density matrix and shows only mild deviations from hermiticity and positivity, which are the defining properties of the continuum Lindblad dynamics. The central ingredient is a new spatial difference operator, which not only fulfills the summation by parts (SBP) property, but also implements a continuum reparametrization property. Using the time evolution of a heavy-quark anti-quark bound state in a hot thermal medium as an explicit example, we show how the reparametrization neutral summation-by-parts (RN-SBP) operator enables an accurate simulation of the full dissipative dynamics of this open quantum system.
      </p>
    </div>


    <div className="section">
      <a
        href="https://link.springer.com/article/10.1007/s10915-018-0722-x"
      >
        <h2 className="publication-title">
          A Stable Domain Decomposition Technique for Advection–Diffusion Problems
        </h2>
      </a>
      <p>
        The use of implicit methods for numerical time integration typically generates very large systems of equations, often too large to fit in memory. To address this it is necessary to investigate ways to reduce the sizes of the involved linear systems. We describe a domain decomposition approach for the advection–diffusion equation, based on the Summation-by-Parts technique in both time and space. The domain is partitioned into non-overlapping subdomains. A linear system consisting only of interface components is isolated by solving independent subdomain-sized problems. The full solution is then computed in terms of the interface components. The Summation-by-Parts technique provides a solid theoretical framework in which we can mimic the continuous energy method, allowing us to prove both stability and invertibility of the scheme. In a numerical study we show that single-domain implementations of Summation-by-Parts based time integration can be improved upon significantly. Using our proposed method we are able to compute solutions for grid resolutions that cannot be handled efficiently using a single-domain formulation. An order of magnitude speed-up is observed, both compared to a single-domain formulation and to explicit Runge–Kutta time integration.

      </p>
    </div>


    <div className="section">
      <a
        href="https://www.sciencedirect.com/science/article/pii/S0021999120306471"
      >
        <h2 className="publication-title">
          Learning to differentiate
        </h2>
      </a>
      <p>
        Artificial neural networks together with associated computational libraries provide a powerful framework for constructing both classification and regression algorithms. In this paper we use neural networks to design linear and non-linear discrete differential operators. We show that neural network based operators can be used to construct stable discretizations of initial boundary-value problems by ensuring that the operators satisfy a discrete analogue of integration-by-parts known as summation-by-parts. Our neural network approach with linear activation functions is compared and contrasted with a more traditional linear algebra approach. An application to overlapping grids is explored. The strategy developed in this work opens the door for constructing stable differential operators on general meshes.
      </p>
    </div>


    <div className="section">
      <a
        href="https://link.springer.com/article/10.1007/s10543-021-00882-z"
      >
        <h2 className="publication-title">
          An efficient hybrid method for uncertainty quantification
        </h2>
      </a>
      <p>
        A technique for coupling an intrusive and non-intrusive uncertainty quantification method is proposed. The intrusive approach uses a combination of polynomial chaos and stochastic Galerkin projection. The non-intrusive method uses numerical integration by combining quadrature rules and the probability density functions of the prescribed uncertainties. A stable coupling procedure between the two methods at an interface is constructed. The efficiency of the hybrid method is exemplified using hyperbolic systems of equations, and verified by numerical experiments.
      </p>
    </div>
  </div>
)


export default HomePage
