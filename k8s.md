# Introduction: Authentication in Amazon EKS

Authentication is the first gatekeeper for any interaction with an Amazon EKS cluster. Whether a request comes from a developer using `kubectl`, a CI/CD pipeline, or a Pod running inside the cluster, EKS must verify the identity of the requester before granting access.

In EKS, identity management is a "handshake" between two systems: **AWS Identity and Access Management (IAM)** handles the identity, while **Kubernetes RBAC** (Role-Based Access Control) handles the permissions.

---

## The Authentication Flow

When a user or service interacts with the EKS API server, the process typically follows this lifecycle:

1.  **Identity Verification:** The requester presents an AWS IAM identity (User or Role).
2.  **Token Generation:** The AWS CLI or `aws-iam-authenticator` generates a signed STS (Security Token Service) token.
3.  **Validation:** The EKS control plane validates this token against AWS IAM to ensure the requester is who they say they are.
4.  **Mapping:** Once verified, the IAM identity is mapped to a Kubernetes user or group.



## Key Authentication Methods

As of 2026, there are three primary ways to manage how identities are recognized by your cluster. AWS now strongly recommends the **Access Entry API** over the legacy ConfigMap method.

| Method | Description | Best Use Case |
| :--- | :--- | :--- |
| **EKS Access Entries** | The modern, API-driven approach. Allows you to manage permissions directly via AWS APIs, Console, or Terraform. | **Recommended** for all new clusters and GitOps workflows. |
| **aws-auth ConfigMap** | The legacy method where mappings are stored in a Kubernetes `ConfigMap` within the `kube-system` namespace. | Maintaining older clusters or specific legacy integrations. |
| **OIDC Identity Providers** | Connects external providers (like Okta, Azure AD, or Google) directly to the cluster. | Organizations requiring SSO without relying solely on IAM users. |

---

## Authentication vs. Authorization

It is critical to distinguish between these two layers to avoid security misconfigurations:

* **Authentication (AuthN):** "Who are you?" 
    * *Handled by:* IAM and EKS Access Entries.
* **Authorization (AuthZ):** "What are you allowed to do?" 
    * *Handled by:* Kubernetes RBAC (`Roles`, `ClusterRoles`, `RoleBindings`).

> [!IMPORTANT]
> Authenticating via IAM does **not** automatically grant you cluster permissions. Even an AWS Administrator may receive an `Unauthorized` error if their IAM identity hasn't been mapped to a Kubernetes RBAC role.

---