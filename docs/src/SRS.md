# Moderation System Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the requirements for the Moderation System of the Restaurant Review Platform.

The Moderation System is responsible for maintaining platform quality by reviewing user-generated content, verifying restaurant ownership, processing reports, handling moderation decisions, and managing support requests.

`Note: The current scope of the Moderation System includes Customer Support Management functionality. However, as the platform evolves, Customer Support Management may be separated into an independent subsystem with its own dedicated requirements and architecture.`

### 1.2 Dependencies

The Moderation System shall use the following systems:

- User authentication
- Restaurant management
- Review creation
- Payment processing
- Notification delivery ( Optional )

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Description |
|--------|------------|
| SRS | Software Requirements Specification |
|FR-* | Functional Requirement |

---

## 2. Overall Description

### 2.1 Product Perspective

The Moderation System is a subsystem of the Restaurant Review Platform.

```text
Restaurant Review Platform
│
├── Authentication System
├── Restaurant Management System
├── Review Management System
├── Search System
└── Moderation System
```

### 2.2 User Classes and Characteristics

#### Moderator

Responsible for reviewing reports, moderating content, and responding to support requests.

#### Vendor / Customer

Users who submit reports and support requests.

### 2.3 Operating Environment

The system shall operate through modern web browsers including:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

The backend shall operate on Linux-based servers.

### 2.4 Design and Implementation Constraints

- All moderation actions must be logged.
- Only authorized moderators may access moderation tools.
- The system must comply with privacy regulations.
- Uploaded media must pass moderation checks before public visibility.

---
## 3. System Features

### 3.1 Restaurant Verification

### 3.1.1 Description and Priority

The Restaurant Verification feature automatically verifies restaurants based on customer reviews. Instead of requiring external documents or third-party verification services, the system evaluates customer feedback submitted through the platform.

A restaurant is considered **Verified** when it has received at least **four reviews** from **four different registered users**, and each review has a rating greater than or equal to **2.5 stars**. This approach ensures that only restaurants with sufficient and reasonably positive customer engagement receive the Verified status.

**Priority:** High

### 3.1.2 Functional Requirements

#### FR-RV-01
The system shall monitor the number of reviews submitted for each restaurant.

#### FR-RV-02
The system shall verify that the reviews used for verification are submitted by different registered users.

#### FR-RV-03
The system shall verify that each review used for verification has a rating greater than or equal to **2.5 stars**.

#### FR-RV-04
The system shall automatically assign a **Verified** status to a restaurant when it has received at least **four valid reviews** from **four different registered users**, each with a rating of **2.5 stars or higher**.

#### FR-RV-05
The system shall display a **Verified Badge** on the restaurant profile after successful verification.

#### FR-RV-06
The system shall record every restaurant verification event in the moderation log.

#### FR-RV-07
The system shall consider only active reviews that have not been removed by moderators when determining whether a restaurant qualifies for verification.

---

## 3.2 Review Moderation

### 3.2.1 Description and Priority

This feature allows moderators to manually review reported customer reviews. Reviews reported by users shall be inspected by moderators before any moderation action is taken.

**Priority:** High

### 3.2.2 Functional Requirements

#### FR-RM-01
The system shall display reported reviews to moderators.

#### FR-RM-02
The moderator shall manually review reported reviews.

#### FR-RM-03
The moderator shall remove reviews that violate platform policies.

#### FR-RM-04
The moderator shall retain reviews that comply with platform policies.

#### FR-RM-05
The system shall record all review moderation actions.

#### FR-RM-06
The system shall maintain a history of all review moderation activities.

---

## 3.3 Media Moderation

### 3.3.1 Description and Priority

This feature allows moderators to manually review images and other media reported by users. Moderators determine whether the uploaded media complies with the platform's content guidelines.

**Priority:** High

### 3.3.2 Functional Requirements

#### FR-MM-01
The system shall display reported media to moderators.

#### FR-MM-02
The moderator shall manually review reported media.

#### FR-MM-03
The moderator shall approve media that complies with platform policies.

#### FR-MM-04
The moderator shall remove inappropriate or prohibited media.

#### FR-MM-05
The system shall record all media moderation actions.

## 3.4 Reports Management

### 3.4.1 Description and Priority

The Reports Management feature allows registered users to report restaurants and customer reviews that violate the platform's policies. Reports may be submitted for reasons such as inappropriate content, fake information, spam, duplicate listings, offensive language, misleading reviews, or other policy violations.

All submitted reports are placed in the moderation queue for manual review. Moderators evaluate each report and determine whether further action is required.

**Priority:** High

### 3.4.2 Functional Requirements

#### Restaurant Reports

##### FR-RP-01
The system shall allow registered users to report a restaurant.

##### FR-RP-02
The system shall require users to select a reason when reporting a restaurant.

##### FR-RP-03
The system shall allow users to provide additional comments with the report.

##### FR-RP-04
The system shall store all restaurant reports.

##### FR-RP-05
The system shall display pending restaurant reports to moderators.

##### FR-RP-06
The moderator shall manually review restaurant reports.

##### FR-RP-07
The moderator shall dismiss invalid restaurant reports.

##### FR-RP-08
The moderator shall take appropriate action if a restaurant report is valid.

---

#### Review Reports

##### FR-RP-09
The system shall allow registered users to report any customer review.

##### FR-RP-10
The system shall require users to select a reason when reporting a review.

##### FR-RP-11
The system shall allow users to provide additional comments describing the reported review.

##### FR-RP-12
The system shall store all review reports.

##### FR-RP-13
The system shall display reported reviews to moderators for manual review.

##### FR-RP-14
The moderator shall manually review each reported review.

##### FR-RP-15
The moderator shall remove reviews that violate the platform's policies.

##### FR-RP-16
The moderator shall dismiss reports for reviews that comply with the platform's policies.

##### FR-RP-17
The system shall record all moderation actions related to restaurant reports and review reports.

##### FR-RP-18
The system shall maintain a history of all submitted reports and their resolution status.


---
### 3.5 Customer Support Management
#### 3.5.1 Description and Priority 
This feature allows moderators to manage customer support requests such as account recovery as well as vendor support such as unable to change status of restaurant or food menu.
**Priority:** Medium
#### 3.5.2 Functional Requirements 
##### FR-CS-01 
The system shall display customer support tickets. 
##### FR-CS-02 
The moderator shall respond to support requests. 
##### FR-CS-03 
The moderator shall update ticket status. 
##### FR-CS-04
The moderator shall close resolved tickets. 
##### FR-CS-05
The system shall maintain ticket history.

---
### 3.6 Moderation History

#### 3.6.1 Description and Priority

This feature maintains a history of moderation actions to support auditing
and allow moderators to undo previous actions when necessary.

**Priority:** Low

#### 3.6.2 Functional Requirements

##### FR-MH-01

The system shall maintain a history of all moderation actions performed in
the following features:

* Restaurant Verification
* Review Moderation
* Media Moderation
* Content Reporting Management
* Customer Support Management

##### FR-MH-02

The system shall allow moderators to view the history of moderation
actions.

##### FR-MH-03

The system shall allow authorized moderators to undo supported moderation
actions using the recorded history.


## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-P-01

The system shall load moderation queues within 3 seconds.

#### NFR-P-02

The system shall support at least 100 concurrent moderator sessions.

#### NFR-P-03

The system shall process moderation actions within 2 seconds.

### 4.2 Security Requirements

#### NFR-S-01

Only authenticated moderators shall access moderation functions.

#### NFR-S-02

Role-based access control shall be enforced.

#### NFR-S-03

All moderation actions shall be logged.

#### NFR-S-05

The system shall protect against unauthorized access.

### 4.3 Reliability Requirements

#### NFR-R-01

The system shall maintain 99% uptime.

#### NFR-R-02

The system shall preserve moderation history records.

#### NFR-R-03

The system shall recover from failures without data loss.

### 4.4 Usability Requirements

#### NFR-U-01

Moderators shall be able to navigate moderation tools without specialized training.

---
