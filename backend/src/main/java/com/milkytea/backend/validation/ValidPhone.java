package com.milkytea.backend.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhone {
    String message() default "手机号格式不正确，必须为11位中国大陆手机号";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
